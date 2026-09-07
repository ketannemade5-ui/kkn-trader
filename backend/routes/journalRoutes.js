const express = require('express');
const router = express.Router();
const {
  getJournalEntries,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
} = require('../controllers/journalController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getJournalEntries);
router.post('/', createJournalEntry);
router.put('/:id', updateJournalEntry);
router.delete('/:id', deleteJournalEntry);

module.exports = router;
