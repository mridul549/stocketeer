const express = require('express');
const router = express.Router();
const sheetController = require('../controllers/sheetController')

router.get('/create', sheetController.createSheet)

module.exports = router;