const { parseCSV, parseXLSX } = require('../utils/parser');
const { insertCompany } = require('../services/companyService');
const { validateCompany } = require('../utils/validation');
const logger = require('../utils/logger');
const path = require('path');

exports.uploadCompanies = async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    let companies;
    if (file.mimetype === 'text/csv') {
      companies = await parseCSV(file.path);
    } else if (
      file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.mimetype === 'application/vnd.ms-excel'
    ) {
      companies = parseXLSX(file.path);
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    let dataInserted = 0;
    let emailsInserted = 0;
    for (const company of companies) {
      const validation = validateCompany(company);
      if (!validation.success) {
        logger.warn(`Validation failed for row: ${JSON.stringify(company)}`);
        continue;
      }
      const inserted = await insertCompany(company);
      if (inserted) {
        if (inserted.dataEntry) dataInserted++;
        if (inserted.emailEntry) emailsInserted++;
      }
    }
    res.json({ company_data_inserted: dataInserted, company_emails_inserted: emailsInserted });
  } catch (err) {
    next(err);
  }
};
