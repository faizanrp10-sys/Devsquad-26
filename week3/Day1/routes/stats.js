const express = require('express');
const { getStats } = require('../controllers/tasks');

const router = express.Router();

router.route('/').get(getStats);

module.exports = router;
