const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

// OpenAI API configuration
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const axiosInstance = axios.create({
  headers: {
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

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

// Delete transaction
app.delete('/api/transactions/:id', async (req, res) => {
  try {
    console.log('Attempting to delete transaction with ID:', req.params.id);
    
    // Validate MongoDB ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log('Invalid MongoDB ID format:', req.params.id);
      return res.status(400).json({ 
        message: 'Invalid transaction ID format'
      });
    }

    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    console.log('Delete operation result:', transaction);
    
    if (!transaction) {
      console.log('Transaction not found with ID:', req.params.id);
      return res.status(404).json({ 
        message: 'Transaction not found'
      });
    }
    
    console.log('Transaction deleted successfully:', transaction);
    res.status(200).json({ 
      message: 'Transaction deleted successfully',
      deletedTransaction: transaction
    });
  } catch (error) {
    console.error('Detailed error deleting transaction:', error);
    res.status(500).json({ 
      message: 'Error deleting transaction',
      error: error.message 
    });
  }
});

// Chatbot endpoint
app.post('/api/chat', async (req, res) => {
  try {
    console.log('Chat endpoint called with body:', req.body);
    const { message } = req.body;
    
    if (!message) {
      console.log('Error: Message is required');
      return res.status(400).json({ message: 'Message is required' });
    }

    // Fetch transactions to provide context to the AI
    console.log('Fetching transactions from database...');
    const transactions = await Transaction.find().sort({ date: -1 });
    console.log(`Found ${transactions.length} transactions`);
    
    // Create a summary of transactions for context
    let transactionSummary = '';
    if (transactions.length > 0) {
      const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
      const categories = [...new Set(transactions.map(t => t.category))];
      
      transactionSummary = `
        You have ${transactions.length} transactions in your database.
        Total amount: $${totalSpent.toFixed(2)}
        Categories: ${categories.join(', ')}
        
        Recent transactions:
        ${transactions.slice(0, 5).map(t => 
          `- ${t.date.toLocaleDateString()}: $${t.amount.toFixed(2)} for ${t.name} (${t.category})`
        ).join('\n')}
      `;
    } else {
      transactionSummary = 'You have no transactions in your database yet.';
    }

    // Create the system message with context
    const systemMessage = `You are a financial assistant for a finance tracking application. 
    You help users understand their spending habits and provide financial advice.
    
    ${transactionSummary}
    
    Provide helpful, concise responses about the user's financial data and general financial advice.`;

    console.log('Calling OpenAI API...');
    // Call OpenAI API using Axios
    const response = await axiosInstance.post(OPENAI_API_URL, {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: message }
      ],
      max_tokens: 500
    });

    console.log('OpenAI API response received');
    // Return the AI response
    res.json({ 
      response: response.data.choices[0].message.content 
    });
  } catch (error) {
    console.error('Detailed error with chatbot:', error);
    res.status(500).json({ 
      message: 'Error processing your request',
      error: error.message 
    });
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