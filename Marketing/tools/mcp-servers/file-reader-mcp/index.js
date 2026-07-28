import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fs from "fs";
import path from "path";
import pdf from "pdf-parse";
import XLSX from "xlsx";

const server = new Server(
  { name: "file-reader-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

function readExcel(filePath) {
  const workbook = XLSX.readFile(filePath);
  const result = { sheets: [] };
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
    result.sheets.push({ name: sheetName, rows: data });
  }
  return result;
}

async function readPdf(filePath) {
  const buffer = fs.readFileSync(filePath);
  const data = await pdf(buffer);
  return { text: data.text, pages: data.numpages };
}

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "read_pdf",
      description: "Extract text content from a PDF file",
      inputSchema: {
        type: "object",
        required: ["filePath"],
        properties: {
          filePath: { type: "string", description: "Absolute path to the PDF file" }
        }
      }
    },
    {
      name: "read_excel",
      description: "Read all sheets and data from an Excel file (.xlsx, .xlsm)",
      inputSchema: {
        type: "object",
        required: ["filePath"],
        properties: {
          filePath: { type: "string", description: "Absolute path to the Excel file" },
          sheetName: { type: "string", description: "Optional: read only this specific sheet" }
        }
      }
    },
    {
      name: "list_excel_sheets",
      description: "List all sheet names in an Excel file",
      inputSchema: {
        type: "object",
        required: ["filePath"],
        properties: {
          filePath: { type: "string", description: "Absolute path to the Excel file" }
        }
      }
    }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "read_pdf") {
    const filePath = path.resolve(args.filePath);
    if (!fs.existsSync(filePath)) throw new Error(`File not found: ${filePath}`);
    const result = await readPdf(filePath);
    return {
      content: [{
        type: "text",
        text: `Pages: ${result.pages}\n\n${result.text}`
      }]
    };
  }

  if (name === "read_excel") {
    const filePath = path.resolve(args.filePath);
    if (!fs.existsSync(filePath)) throw new Error(`File not found: ${filePath}`);
    const workbook = readExcel(filePath);
    const targetSheet = args.sheetName;
    let output = "";
    for (const sheet of workbook.sheets) {
      if (targetSheet && sheet.name !== targetSheet) continue;
      output += `=== Sheet: ${sheet.name} ===\n`;
      for (const row of sheet.rows) {
        output += row.join("\t") + "\n";
      }
      output += "\n";
    }
    return { content: [{ type: "text", text: output || "No data found" }] };
  }

  if (name === "list_excel_sheets") {
    const filePath = path.resolve(args.filePath);
    if (!fs.existsSync(filePath)) throw new Error(`File not found: ${filePath}`);
    const workbook = XLSX.readFile(filePath);
    return {
      content: [{
        type: "text",
        text: `Sheets: ${workbook.SheetNames.join(", ")}`
      }]
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

const transport = new StdioServerTransport();
await server.connect(transport);
