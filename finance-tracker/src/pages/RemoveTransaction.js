import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function RemoveTransaction() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    transaction: null
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/transactions');
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      const data = await response.json();
      setTransactions(data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching transactions');
      setLoading(false);
    }
  };

  const handleDeleteClick = (transaction) => {
    setDeleteDialog({
      open: true,
      transaction: transaction
    });
  };

  const handleDeleteConfirm = async () => {
    const transaction = deleteDialog.transaction;
    try {
      console.log('Attempting to delete transaction:', transaction._id);
      const response = await fetch(`http://localhost:5000/api/transactions/${transaction._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('Delete response:', data);

      if (response.ok) {
        setTransactions(prevTransactions => 
          prevTransactions.filter(t => t._id !== transaction._id)
        );
        setSnackbar({
          open: true,
          message: 'Transaction deleted successfully!',
          severity: 'success'
        });
      } else {
        throw new Error(data.message || 'Failed to delete transaction');
      }
    } catch (error) {
      console.error('Error in delete operation:', error);
      setSnackbar({
        open: true,
        message: `Failed to delete transaction: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setDeleteDialog({ open: false, transaction: null });
    }
  };

  const handleCloseDialog = () => {
    setDeleteDialog({ open: false, transaction: null });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography>Loading transactions...</Typography>
    </Container>
  );

  if (error) return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography color="error">{error}</Typography>
    </Container>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Remove Transactions
        </Typography>

        {transactions.length === 0 ? (
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
            No transactions found
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction._id} hover>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell>{transaction.name}</TableCell>
                    <TableCell>{formatAmount(transaction.amount)}</TableCell>
                    <TableCell>{transaction.category}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(transaction)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this transaction?
          </Typography>
          {deleteDialog.transaction && (
            <Box sx={{ mt: 2, color: 'text.secondary' }}>
              <Typography variant="body2">
                {deleteDialog.transaction.name} - {formatAmount(deleteDialog.transaction.amount)}
              </Typography>
              <Typography variant="body2">
                {formatDate(deleteDialog.transaction.date)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
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

export default RemoveTransaction; 