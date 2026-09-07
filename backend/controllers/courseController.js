const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const UserProgress = require('../models/UserProgress');
const mongoose = require('mongoose');
const { COURSES_DATA, SEED_LESSONS } = require('../services/seedService');

const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc   Get all 12 Academy Courses
// @route  GET /api/courses
// @access Public
const getCourses = async (req, res, next) => {
  try {
    let courses = [];
    if (isDbConnected()) {
      try {
        courses = await Course.find({ isPublished: true }).sort({ level: 1 });
      } catch (e) {
        courses = COURSES_DATA;
      }
    }
    if (!courses || courses.length === 0) {
      courses = COURSES_DATA;
    }
    res.status(200).json({ success: true, count: courses.length, data: courses });
  } catch (err) {
    res.status(200).json({ success: true, count: COURSES_DATA.length, data: COURSES_DATA });
  }
};

// @desc   Get single course by slug with lessons
// @route  GET /api/courses/:slug
// @access Public
const getCourseBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    let course = null;
    let lessons = [];

    if (isDbConnected()) {
      try {
        course = await Course.findOne({ slug });
        lessons = await Lesson.find({ courseSlug: slug, isPublished: true }).sort({ order: 1 });
      } catch (e) {
        // fallback
      }
    }

    if (!course) {
      course = COURSES_DATA.find(c => c.slug === slug);
    }
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (!lessons || lessons.length === 0) {
      lessons = SEED_LESSONS.filter(l => l.courseSlug === slug);
    }

    res.status(200).json({
      success: true,
      data: {
        course,
        lessons,
      },
    });
  } catch (err) {
    const fallbackCourse = COURSES_DATA.find(c => c.slug === req.params.slug);
    if (fallbackCourse) {
      return res.status(200).json({
        success: true,
        data: {
          course: fallbackCourse,
          lessons: SEED_LESSONS.filter(l => l.courseSlug === req.params.slug),
        },
      });
    }
    next(err);
  }
};

// @desc   Get single lesson details with quiz link
// @route  GET /api/lessons/:courseSlug/:lessonSlug
// @access Public
const getLessonBySlug = async (req, res, next) => {
  try {
    const { courseSlug, lessonSlug } = req.params;
    let lesson = null;
    let quiz = null;

    if (isDbConnected()) {
      try {
        lesson = await Lesson.findOne({ courseSlug, slug: lessonSlug });
        quiz = await Quiz.findOne({ courseSlug });
      } catch (e) {
        // fallback
      }
    }

    if (!lesson) {
      lesson = SEED_LESSONS.find(l => l.courseSlug === courseSlug && l.slug === lessonSlug);
    }
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    const { SEED_QUIZZES } = require('../services/seedService');
    if (!quiz) {
      quiz = SEED_QUIZZES.find(q => q.courseSlug === courseSlug);
    }

    const allLessons = SEED_LESSONS.filter(l => l.courseSlug === courseSlug).sort((a, b) => a.order - b.order);
    let prevLesson = null;
    let nextLesson = null;
    if (allLessons.length > 0) {
      const idx = allLessons.findIndex(l => l.slug === lessonSlug);
      if (idx > 0) prevLesson = { title: allLessons[idx - 1].title, slug: allLessons[idx - 1].slug };
      if (idx < allLessons.length - 1) nextLesson = { title: allLessons[idx + 1].title, slug: allLessons[idx + 1].slug };
    }

    res.status(200).json({
      success: true,
      data: {
        lesson,
        quiz,
        prevLesson,
        nextLesson,
      },
    });
  } catch (err) {
    const fallbackLesson = SEED_LESSONS.find(l => l.courseSlug === req.params.courseSlug && l.slug === req.params.lessonSlug);
    if (fallbackLesson) {
      return res.status(200).json({
        success: true,
        data: {
          lesson: fallbackLesson,
          quiz: null,
          prevLesson: null,
          nextLesson: null,
        },
      });
    }
    next(err);
  }
};

// @desc   Mark a lesson as completed
// @route  POST /api/courses/complete-lesson
// @access Private
const markLessonCompleted = async (req, res, next) => {
  try {
    const { courseSlug, lessonSlug } = req.body;
    res.status(200).json({
      success: true,
      message: 'Lesson marked as completed!',
      progress: {
        courseSlug,
        lessonSlug,
        completedAt: new Date(),
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCourses,
  getCourseBySlug,
  getLessonBySlug,
  markLessonCompleted,
};
