const express = require('express');
const router = express.Router();
const pricingController = require('../controllers/pricingController')

router.post('/setPrice', pricingController.setPrice)

module.exports = router;