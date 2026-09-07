const express = require('express');
const router = express.Router();
const { askKKNAI } = require('../controllers/aiController');

router.post('/ask', askKKNAI);

module.exports = router;
