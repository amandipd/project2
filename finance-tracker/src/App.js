import "./App.css";
import React from "react";
import { Route, Routes, Link } from "react-router-dom";
import AddTransaction from "./pages/AddTransaction";
import Transaction from "./pages/Transactions";
// Import Material UI components
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container,
  Box
} from '@mui/material';
// Import Material UI icons
import { 
  AccountBalance as AccountBalanceIcon,
  AddCircle as AddCircleIcon 
} from '@mui/icons-material';
// Import Roboto font
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function App() {
  return (
    // Main container with a light gray background
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      {/* Material UI AppBar for navigation */}
      <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          {/* Logo and app name */}
          <AccountBalanceIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Finance Tracker
          </Typography>
          
          {/* Navigation buttons */}
          <Button 
            color="inherit" 
            component={Link} 
            to="/transactions"
            startIcon={<AccountBalanceIcon />}
          >
            Transactions
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/add-transaction"
            startIcon={<AddCircleIcon />}
          >
            Add Transaction
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main content container */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Routes>
          <Route path="/add-transaction" element={<AddTransaction />} />
          <Route path="/transactions" element={<Transaction />} />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;
