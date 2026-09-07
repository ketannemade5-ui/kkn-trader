const express = require('express');
const router = express.Router();
const { getBlogPosts, getBlogPostBySlug } = require('../controllers/blogController');

router.get('/', getBlogPosts);
router.get('/:slug', getBlogPostBySlug);

module.exports = router;
