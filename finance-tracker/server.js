const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Import Transaction model
const Transaction = require('./models/Transaction');

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection with detailed logging
console.log('Attempting to connect to MongoDB...');
console.log('Connection URI:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log('Database name:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
    console.log('Port:', mongoose.connection.port);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    console.error('Please ensure:');
    console.error('1. MongoDB is running locally');
    console.error('2. The connection string is correct');
    console.error('3. MongoDB Compass is properly configured');
    process.exit(1);
  });

// Add connection event listeners
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
});

// Routes
// Get all transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Error fetching transactions' });
  }
});

// Add new transaction
app.post('/api/transactions', async (req, res) => {
  try {
    const { date, name, amount, category } = req.body;
    
    // Validate required fields
    if (!date || !name || !amount || !category) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create new transaction
    const transaction = new Transaction({
      date: new Date(date),
      name,
      amount: Number(amount),
      category
    });

    // Save to database
    const savedTransaction = await transaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: 'Error creating transaction' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 