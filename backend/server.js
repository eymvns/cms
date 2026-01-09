const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { MongoMemoryServer } = require('mongodb-memory-server');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Database connection
async function connectDB() {
  try {
    let mongoUri;

    if (process.env.MONGO_URI) {
      // Use provided MongoDB URI
      mongoUri = process.env.MONGO_URI;
      console.log('📡 Using MONGO_URI from environment');
    } else {
      // Use local MongoDB
      mongoUri = 'mongodb://localhost:27017/hotelreserve';
      console.log('📡 Using local MongoDB: mongodb://localhost:27017/hotelreserve');
    }

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.error('💡 Make sure MongoDB is running: mongod');
    process.exit(1);
  }
}

connectDB();

// Serve static files (uploads)
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/trips', require('./routes/trips'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/admin', require('./routes/admin'));

app.get('/', (req, res) => {
  res.json({ message: 'VOIMA API - Plateforme de Covoiturage' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Socket.io
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Store io in app for access in routes
app.set('io', io);

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user's room for private messages
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  // Handle private messages
  socket.on('sendMessage', async (data) => {
    const { to, content, from } = data;
    
    // Save message to DB (already done in API route)
    // Emit to recipient
    socket.to(to).emit('newMessage', {
      from,
      content,
      timestamp: new Date()
    });
  });

  // Typing indicator
  socket.on('typing', (data) => {
    socket.to(data.to).emit('typing', { from: data.from });
  });

  socket.on('stopTyping', (data) => {
    socket.to(data.to).emit('stopTyping', { from: data.from });
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

module.exports = app;