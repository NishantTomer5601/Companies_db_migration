const express = require('express');
const multer = require('multer');
const companyController = require('../controllers/companyController');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/upload-companies', upload.single('file'), companyController.uploadCompanies);

module.exports = router;
