const express = require('express');
const router = express.Router();
const { getQuiz, submitQuiz } = require('../controllers/quizController');

router.get('/:courseSlug', getQuiz);
router.post('/:courseSlug/submit', submitQuiz);

module.exports = router;
