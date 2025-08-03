const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: './config.env' });

const app = express();

// Middleware
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import Routes
const authRoutes = require('./routes/auth');
const componentsRoutes = require('./routes/components');
const stocklogsRoutes = require('./routes/stocklogs');
const dashboardRoutes = require('./routes/dashboard');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/components', componentsRoutes);
app.use('/api/stocklogs', stocklogsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
