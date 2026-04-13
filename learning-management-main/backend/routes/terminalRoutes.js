const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { executeCode } = require('../controllers/terminalController');

router.post('/execute', protect, executeCode);

module.exports = router;