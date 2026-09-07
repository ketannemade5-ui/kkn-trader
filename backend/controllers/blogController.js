const Blog = require('../models/Blog');
const { SEED_BLOGS } = require('../services/seedService');
const mongoose = require('mongoose');

const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc   Get published blog posts with search and category filters
// @route  GET /api/blog
// @access Public
const getBlogPosts = async (req, res, next) => {
  try {
    const { category, search } = req.query;

    if (isDbConnected()) {
      try {
        const query = { isPublished: true };
        if (category && category !== 'All') query.category = category;
        if (search) {
          query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { excerpt: { $regex: search, $options: 'i' } },
          ];
        }
        const posts = await Blog.find(query).sort({ createdAt: -1 });
        if (posts && posts.length > 0) {
          return res.status(200).json({ success: true, count: posts.length, data: posts });
        }
      } catch (e) {
        // fallback
      }
    }

    let filtered = [...SEED_BLOGS];
    if (category && category !== 'All') {
      filtered = filtered.filter(b => b.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      filtered = filtered.filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.excerpt.toLowerCase().includes(search.toLowerCase()));
    }

    res.status(200).json({
      success: true,
      count: filtered.length,
      data: filtered,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Get single article by slug
// @route  GET /api/blog/:slug
// @access Public
const getBlogPostBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    let post = null;

    if (isDbConnected()) {
      try {
        post = await Blog.findOne({ slug });
      } catch (e) {
        // fallback
      }
    }

    if (!post) {
      post = SEED_BLOGS.find(b => b.slug === slug);
    }

    if (!post) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    const related = SEED_BLOGS.filter(b => b.slug !== slug).slice(0, 2);

    res.status(200).json({
      success: true,
      data: {
        post,
        related,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getBlogPosts,
  getBlogPostBySlug,
};
