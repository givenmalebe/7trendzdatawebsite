import XLSX from "xlsx";
import fs from "fs";

const filePath = "C:\\Users\\Surf\\Desktop\\7Trendz_data\\Marketing\\Sales Tracker 2022\\Sales Tracker Sales Management System.xlsm";
const workbook = XLSX.readFile(filePath, { cellDates: true });

const dataSheets = ["T", "C", "O", "Q", "P", "S", "Dashboard", "Configuration", "Historical Report", "Planning Report"];

let output = "";

for (const sheetName of dataSheets) {
  if (!workbook.SheetNames.includes(sheetName)) continue;
  
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "", raw: false });
  
  output += `\n${"=".repeat(100)}\n`;
  output += `SHEET: ${sheetName} (${data.length} rows x ${Math.max(...data.map(r => r.length))} cols)\n`;
  output += `${"=".repeat(100)}\n\n`;
  
  for (let r = 0; r < Math.min(data.length, 50); r++) {
    const row = data[r];
    const vals = row.map((v, c) => {
      const s = String(v).trim();
      return s ? `[col${c}] ${s.substring(0, 80)}` : null;
    }).filter(Boolean).join(" | ");
    if (vals) output += `Row ${r}: ${vals}\n`;
  }
  
  // Check for any data beyond row 50
  let hasMore = false;
  for (let r = 50; r < data.length; r++) {
    if (data[r].some(v => String(v).trim())) { hasMore = true; break; }
  }
  if (hasMore) output += `...(more data beyond row 50, total ${data.length} rows)\n`;
}

// Also read Configuration columns more carefully
const configSheet = workbook.Sheets["Configuration"];
const configData = XLSX.utils.sheet_to_json(configSheet, { header: 1, defval: "", raw: false });

output += `\n${"=".repeat(100)}\n`;
output += `CONFIGURATION HEADERS (Row 1 & 2)\n`;
output += `${"=".repeat(100)}\n\n`;
for (let r = 0; r < 3; r++) {
  if (configData[r]) {
    const vals = configData[r].map((v, c) => {
      const s = String(v).trim();
      return s ? `[col${c}] ${s}` : null;
    }).filter(Boolean).join(" | ");
    if (vals) output += `Row ${r}: ${vals}\n`;
  }
}

output += `\nConfiguration items (first 15 data rows):\n`;
for (let r = 3; r < 18; r++) {
  if (configData[r]) {
    const vals = configData[r].map((v, c) => {
      const s = String(v).trim();
      return s ? `[col${c}] ${s}` : null;
    }).filter(Boolean).join(" | ");
    if (vals) output += `Row ${r}: ${vals}\n`;
  }
}

fs.writeFileSync("C:\\Users\\Surf\\Desktop\\7Trendz_data\\Marketing\\sales_tracker_data_sheets.txt", output, "utf8");
console.log("Done.");
