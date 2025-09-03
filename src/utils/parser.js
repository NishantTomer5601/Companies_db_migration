const csv = require('csv-parser');
const xlsx = require('xlsx');
const fs = require('fs');

const EXPECTED_COLUMNS = [
  'first_name',
  'last_name',
  'email',
  'title',
  'organization_name',
  'industry',
  'city',
  'linkedin_url',
];

function normalizeHeaders(obj) {
  const normalized = {};
  for (const key in obj) {
    // Trim, lowercase, and replace spaces/underscores
    const cleanKey = key.trim().toLowerCase().replace(/\s+/g, '_');
    normalized[cleanKey] = obj[key].trim?.() ?? obj[key];
  }
  // Only keep expected columns
  const filtered = {};
  for (const col of EXPECTED_COLUMNS) {
    filtered[col] = normalized[col] ?? '';
  }
  return filtered;
}

function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(normalizeHeaders(data)))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

function parseXLSX(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const rawRows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  return rawRows.map(normalizeHeaders);
}

module.exports = { parseCSV, parseXLSX };
