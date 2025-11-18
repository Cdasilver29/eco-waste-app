const { v4: uuidv4 } = require('uuid');
const aiChatService = require('../services/aiChatService');
const User = require('../models/User');

// @desc    Start new chat session
// @route   POST /api/chat/session
// @access  Private
exports.createSession = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.municipality) {
      return res.status(400).json({
        error: 'No municipality assigned. Please update your profile.'
      });
    }

    const sessionId = uuidv4();

    res.json({
      success: true,
      data: {
        sessionId,
        message: 'Chat session created. How can I help you today? ♻️'
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create session',
      message: error.message
    });
  }
};

// @desc    Send message to chatbot
// @route   POST /api/chat/message
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || !sessionId) {
      return res.status(400).json({
        error: 'Message and sessionId are required'
      });
    }

    if (message.length > 1000) {
      return res.status(400).json({
        error: 'Message too long. Maximum 1000 characters.'
      });
    }

    const user = await User.findById(req.user._id);

    if (!user.municipality) {
      return res.status(400).json({
        error: 'No municipality assigned'
      });
    }

    // Get AI response
    const response = await aiChatService.chat(
      req.user._id,
      message,
      sessionId,
      user.municipality
    );

    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Chat message error:', error);
    res.status(500).json({
      error: 'Failed to process message',
      message: error.message
    });
  }
};

// @desc    Provide feedback on chat
// @route   POST /api/chat/feedback
// @access  Private
exports.provideFeedback = async (req, res) => {
  try {
    const { sessionId, rating, helpful, comment } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        error: 'SessionId is required'
      });
    }

    const result = await aiChatService.provideFeedback(
      sessionId,
      req.user._id,
      { rating, helpful, comment }
    );

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to submit feedback',
      message: error.message
    });
  }
};

// @desc    End chat session
// @route   POST /api/chat/end-session
// @access  Private
exports.endSession = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        error: 'SessionId is required'
      });
    }

    await aiChatService.endSession(sessionId, req.user._id);

    res.json({
      success: true,
      message: 'Session ended successfully'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to end session',
      message: error.message
    });
  }
};

// @desc    Get chat history
// @route   GET /api/chat/history
// @access  Private
exports.getChatHistory = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const history = await aiChatService.getConversationHistory(
      req.user._id,
      parseInt(limit)
    );

    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch history',
      message: error.message
    });
  }
};

// @desc    Get chat statistics
// @route   GET /api/chat/stats
// @access  Private
exports.getChatStats = async (req, res) => {
  try {
    const stats = await aiChatService.getChatStats(req.user._id);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch stats',
      message: error.message
    });
  }
};
