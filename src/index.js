require('dotenv').config();
const express = require('express');
const companyRoutes = require('./routes/companyRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(express.json());

app.use('/api', companyRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
