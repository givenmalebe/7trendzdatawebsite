import XLSX from "xlsx";
import fs from "fs";

const filePath = "C:\\Users\\Surf\\Desktop\\7Trendz_data\\Marketing\\Sales Tracker 2022\\Sales Tracker Sales Management System.xlsm";
const workbook = XLSX.readFile(filePath);

let output = "=== SALES TRACKER - FULL STRUCTURE ===\n\n";
output += `Sheets (${workbook.SheetNames.length}): ${workbook.SheetNames.join(", ")}\n\n`;

for (const sheetName of workbook.SheetNames) {
  const sheet = workbook.Sheets[sheetName];
  const ref = sheet["!ref"] || "";
  const merge = sheet["!merges"] || [];
  
  output += `\n${"=".repeat(80)}\n`;
  output += `SHEET: ${sheetName}\n`;
  output += `Range: ${ref}\n`;
  output += `Merged cells: ${merge.length}\n`;
  output += `${"=".repeat(80)}\n\n`;
  
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "", raw: false });
  
  for (let r = 0; r < data.length; r++) {
    const row = data[r];
    const line = row.map((cell, c) => {
      const cellRef = XLSX.utils.encode_cell({ r, c });
      return cell ? `[${cellRef}] ${String(cell).substring(0, 120)}` : null;
    }).filter(Boolean).join(" | ");
    
    if (line) output += `Row ${r}: ${line}\n`;
  }
}

fs.writeFileSync("C:\\Users\\Surf\\Desktop\\7Trendz_data\\Marketing\\sales_tracker_structure.txt", output, "utf8");
console.log("Done. Output written.");
