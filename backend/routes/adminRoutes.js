const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllUsers,
  toggleUserStatus,
  saveCourse,
  saveBlogPost,
  deleteBlogPost,
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');

router.use(protect);
router.use(requireAdmin);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.put('/users/:id/status', toggleUserStatus);
router.post('/courses', saveCourse);
router.post('/blogs', saveBlogPost);
router.delete('/blogs/:id', deleteBlogPost);

module.exports = router;
