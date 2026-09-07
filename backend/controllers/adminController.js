const User = require('../models/User');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Blog = require('../models/Blog');
const Trade = require('../models/Trade');
const Position = require('../models/Position');

// @desc   Get institutional platform stats for Admin
// @route  GET /api/admin/stats
// @access Private (Admin)
const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'ACTIVE' });
    const totalCourses = await Course.countDocuments();
    const totalLessons = await Lesson.countDocuments();
    const totalBlogs = await Blog.countDocuments();
    const totalTrades = await Trade.countDocuments();
    const activePositions = await Position.countDocuments({ status: 'OPEN' });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        totalCourses,
        totalLessons,
        totalBlogs,
        totalTrades,
        activePositions,
        platformUptime: '99.98%',
        simulationEngine: 'ONLINE',
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Get all users with search
// @route  GET /api/admin/users
// @access Private (Admin)
const getAllUsers = async (req, res, next) => {
  try {
    const { search } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    const users = await User.find(query).select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Toggle user active / suspended status
// @route  PUT /api/admin/users/:id/status
// @access Private (Admin)
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.status = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    await user.save();

    res.status(200).json({
      success: true,
      message: `User status changed to ${user.status}`,
      user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Create or update Course (Admin)
// @route  POST /api/admin/courses
// @access Private (Admin)
const saveCourse = async (req, res, next) => {
  try {
    const { id, title, slug, level, category, tagline, description, difficulty, estimatedHours } = req.body;

    let course;
    if (id) {
      course = await Course.findByIdAndUpdate(id, req.body, { new: true });
    } else {
      course = await Course.create({ title, slug, level, category, tagline, description, difficulty, estimatedHours });
    }

    res.status(200).json({
      success: true,
      message: 'Course saved successfully',
      data: course,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Create or update Blog article (Admin)
// @route  POST /api/admin/blogs
// @access Private (Admin)
const saveBlogPost = async (req, res, next) => {
  try {
    const { id, title, slug, category, excerpt, content, tags, isPublished, author } = req.body;

    let blog;
    if (id) {
      blog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
    } else {
      blog = await Blog.create({ title, slug, category, excerpt, content, tags, isPublished, author });
    }

    res.status(200).json({
      success: true,
      message: 'Blog post saved successfully',
      data: blog,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Delete a blog post (Admin)
// @route  DELETE /api/admin/blogs/:id
// @access Private (Admin)
const deleteBlogPost = async (req, res, next) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Blog article deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  toggleUserStatus,
  saveCourse,
  saveBlogPost,
  deleteBlogPost,
};
