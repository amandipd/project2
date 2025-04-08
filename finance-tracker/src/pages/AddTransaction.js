import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Box,
  Stack,
  Snackbar,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

// Custom styled components
const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(6),
  },
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5),
  fontSize: '1.1rem',
  borderRadius: 8,
  textTransform: 'none',
}));

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
    date: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
    name: '',
    amount: '',
    category: ''
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
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
        body: JSON.stringify({
          ...formData,
          date: new Date(formData.date)
        }),
      });
      
      if (response.ok) {
        // Reset form
        setFormData({
          date: new Date().toISOString().split('T')[0],
          name: '',
          amount: '',
          category: ''
        });
        setSnackbar({
          open: true,
          message: 'Transaction added successfully!',
          severity: 'success'
        });
      } else {
        throw new Error('Failed to add transaction');
      }
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({
        open: true,
        message: 'Failed to add transaction. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <FormContainer elevation={3}>
        <Stack spacing={4}>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <AddCircleOutlineIcon 
              sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} 
            />
            <Typography variant="h4" component="h1" gutterBottom>
              Add Transaction
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Enter the details of your new transaction below
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                type="date"
                label="Date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <TextField
                label="Transaction Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                fullWidth
                placeholder="Enter transaction name"
              />

              <TextField
                label="Amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                required
                fullWidth
                placeholder="Enter amount"
                InputProps={{
                  startAdornment: '$',
                }}
              />

              <TextField
                select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                fullWidth
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>

              <SubmitButton
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                startIcon={<AddCircleOutlineIcon />}
              >
                Add Transaction
              </SubmitButton>
            </Stack>
          </form>
        </Stack>
      </FormContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default AddTransaction;
