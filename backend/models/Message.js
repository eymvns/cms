const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date,
    default: null
  }
});

// Index for efficient queries
messageSchema.index({ from: 1, to: 1, timestamp: -1 });
messageSchema.index({ to: 1, read: 1 });

// Virtual for conversation ID (sorted user IDs)
messageSchema.virtual('conversationId').get(function() {
  return [this.from.toString(), this.to.toString()].sort().join('_');
});

// Method to mark as read
messageSchema.methods.markAsRead = function() {
  this.read = true;
  this.readAt = new Date();
  return this.save();
};

module.exports = mongoose.model('Message', messageSchema);