const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController')

router.get('/getCompanies', companyController.getCompanies)
router.get('/filter', companyController.filterCompanies)
router.get('/filterNoP', companyController.filterCompaniesNoPagination)
router.post('/add', companyController.addCompany)

module.exports = router;