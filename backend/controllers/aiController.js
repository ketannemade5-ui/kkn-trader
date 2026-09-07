const { askAI } = require('../services/aiService');

// @desc   Ask educational trading query to KKN AI Assistant
// @route  POST /api/ai/ask
// @access Public
const askKKNAI = async (req, res, next) => {
  try {
    const { prompt, context } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid question or trading concept.',
      });
    }

    const result = await askAI({ prompt, context });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  askKKNAI,
};
