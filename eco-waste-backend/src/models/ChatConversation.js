const mongoose = require('mongoose');

const chatConversationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: String,
    required: true,
    unique: true,   // already creates an index
    index: true     // also creates an index
  },
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    tokens: Number
  }],
  context: {
    municipality: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Municipality'
    },
    language: {
      type: String,
      default: 'en'
    },
    topic: String
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    helpful: Boolean,
    comment: String
  },
  metadata: {
    model: String,
    totalTokens: {
      type: Number,
      default: 0
    }
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Keep extra indexes that matter
chatConversationSchema.index({ user: 1, createdAt: -1 });
chatConversationSchema.index({ active: 1 });

module.exports = mongoose.model('ChatConversation', chatConversationSchema);

