const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function isCompanyDataDuplicate(organization_name) {
  // Only check for duplicate in Company_data
  const dataExists = await prisma.company_data.findFirst({
    where: { organization_name: { equals: organization_name, mode: 'insensitive' } }
  });
  return !!dataExists;
}

async function isCompanyEmailDuplicate(organization_name, email) {
  // Check for duplicate in Company_emails for same organization_name and email
  const emailExists = await prisma.company_emails.findFirst({
    where: {
      organization_name: { equals: organization_name, mode: 'insensitive' },
      email: { equals: email, mode: 'insensitive' }
    }
  });
  return !!emailExists;
}

async function insertCompany(company) {
  const { organization_name, industry, city, first_name, last_name, email, title, linkedin_url } = company;
  let dataEntry = null;
  let emailEntry = null;
  // Insert into Company_data only if not already present
  if (!(await isCompanyDataDuplicate(organization_name))) {
    dataEntry = await prisma.company_data.create({
      data: { organization_name, industry, city }
    });
  }
  // Insert into Company_emails only if not already present for this email
  if (!(await isCompanyEmailDuplicate(organization_name, email))) {
    try {
      emailEntry = await prisma.company_emails.create({
        data: { organization_name, first_name, last_name, email, title, linkedin_url }
      });
    } catch (err) {
      // If unique constraint fails, skip and continue
      if (err.code === 'P2002' && err.meta?.target?.includes('email')) {
        // Duplicate email, skip
        emailEntry = null;
      } else {
        throw err;
      }
    }
  }
  return { dataEntry, emailEntry };
}

module.exports = { isCompanyDataDuplicate, isCompanyEmailDuplicate, insertCompany };
