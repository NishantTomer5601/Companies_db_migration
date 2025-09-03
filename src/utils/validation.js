const { z } = require('zod');

const companySchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.string().optional(),
  title: z.string().optional(),
  organization_name: z.string().min(1),
  industry: z.string().optional(),
  city: z.string().optional(),
  linkedin_url: z.string().optional(),
});

function validateCompany(data) {
  try {
    companySchema.parse(data);
    return { success: true };
  } catch (e) {
    return { success: false, error: e.errors };
  }
}

module.exports = { validateCompany };
