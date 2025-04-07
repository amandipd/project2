import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  MenuItem,
  Paper
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

const categories = [
  'Food & Dining',
  'Shopping',
  'Transportation',
  'Entertainment',
  'Bills & Utilities',
  'Health & Fitness',
  'Travel',
  'Other'
];

function AddTransaction() {
  const [formData, setFormData] = useState({
    date: new Date(),
    name: '',
    amount: '',
    category: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prevState => ({
      ...prevState,
      date: date
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        // Reset form
        setFormData({
          date: new Date(),
          name: '',
          amount: '',
          category: ''
        });
        alert('Transaction added successfully!');
      } else {
        throw new Error('Failed to add transaction');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add transaction. Please try again.');
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Add New Transaction
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date"
              value={formData.date}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
            />
          </LocalizationProvider>

          <TextField
            fullWidth
            margin="normal"
            label="Transaction Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            margin="normal"
            label="Amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
            }}
          />

          <TextField
            fullWidth
            margin="normal"
            select
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>

          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth 
            sx={{ mt: 3 }}
          >
            Add Transaction
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default AddTransaction;
