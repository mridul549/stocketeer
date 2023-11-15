const express = require('express');
const router = express.Router();

router.use('/company', require('./company'))
router.use('/pricing', require('./pricing'))

module.exports = router;