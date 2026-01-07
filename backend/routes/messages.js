const express = require('express');
const Message = require('../models/Message');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get conversation with a specific user
router.get('/:userId', auth, async (req, res) => {
  try {
    const otherUserId = req.params.userId;

    // Check if user exists
    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get messages between current user and other user
    const messages = await Message.find({
      $or: [
        { from: req.user._id, to: otherUserId },
        { from: otherUserId, to: req.user._id }
      ]
    })
    .populate('from', 'name')
    .populate('to', 'name')
    .sort({ timestamp: 1 });

    // Mark messages as read
    await Message.updateMany(
      { from: otherUserId, to: req.user._id, read: false },
      { read: true, readAt: new Date() }
    );

    res.json({ 
      messages,
      otherUser: {
        id: otherUser._id,
        name: otherUser.name
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send message
router.post('/', auth, async (req, res) => {
  try {
    const { to, content } = req.body;

    if (!to || !content) {
      return res.status(400).json({ message: 'Recipient and content are required' });
    }

    // Check if recipient exists
    const recipient = await User.findById(to);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    // Create message
    const message = new Message({
      from: req.user._id,
      to,
      content: content.trim()
    });

    await message.save();
    await message.populate('from', 'name');

    // Emit to recipient via Socket.io (will be handled in server.js)
    const io = req.app.get('io');
    if (io) {
      io.to(to).emit('newMessage', {
        message,
        from: req.user._id
      });
    }

    res.status(201).json({ message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's conversations (recent chats)
router.get('/', auth, async (req, res) => {
  try {
    // Get unique conversation partners
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { from: req.user._id },
            { to: req.user._id }
          ]
        }
      },
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$from', req.user._id] },
              '$to',
              '$from'
            ]
          },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                { 
                  $and: [
                    { $eq: ['$to', req.user._id] },
                    { $eq: ['$read', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          user: {
            id: '$user._id',
            name: '$user.name'
          },
          lastMessage: {
            id: '$lastMessage._id',
            content: '$lastMessage.content',
            timestamp: '$lastMessage.timestamp',
            from: '$lastMessage.from'
          },
          unreadCount: 1
        }
      }
    ]);

    res.json({ conversations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark messages as read
router.put('/:userId/read', auth, async (req, res) => {
  try {
    await Message.updateMany(
      { from: req.params.userId, to: req.user._id, read: false },
      { read: true, readAt: new Date() }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;