const express = require('express');
const router = express.Router();
const { getCourses, getCourseBySlug, getLessonBySlug, markLessonCompleted } = require('../controllers/courseController');
const { protect } = require('../middleware/auth');

router.get('/', getCourses);
router.get('/:slug', getCourseBySlug);
router.get('/:courseSlug/:lessonSlug', getLessonBySlug);
router.post('/complete-lesson', protect, markLessonCompleted);

module.exports = router;
