import "./App.css";
import React, { useState } from "react";
import { Route, Routes, Link } from "react-router-dom";
import AddTransaction from "./pages/AddTransaction";
import Transaction from "./pages/Transactions";
import RemoveTransaction from "./pages/RemoveTransaction";
// Import Material UI components
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container,
  Box,
  Fab
} from '@mui/material';
// Import Material UI icons
import { 
  AccountBalance as AccountBalanceIcon,
  AddCircle as AddCircleIcon,
  DeleteOutline as DeleteIcon,
  Chat as ChatIcon
} from '@mui/icons-material';
// Import Roboto font
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
// Import ChatBot component
import ChatBot from './components/ChatBot';

function App() {
  const [showChatBot, setShowChatBot] = useState(false);

  const toggleChatBot = () => {
    setShowChatBot(!showChatBot);
  };

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
          <Button 
            color="inherit" 
            component={Link} 
            to="/remove-transaction"
            startIcon={<DeleteIcon />}
          >
            Remove Transaction
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main content container */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Routes>
          <Route path="/add-transaction" element={<AddTransaction />} />
          <Route path="/transactions" element={<Transaction />} />
          <Route path="/remove-transaction" element={<RemoveTransaction />} />
          <Route path="/" element={<Transaction />} />
        </Routes>
      </Container>

      {/* Chat Bot Fab Button */}
      <Fab 
        color="primary" 
        aria-label="chat" 
        onClick={toggleChatBot}
        sx={{ 
          position: 'fixed', 
          bottom: 20, 
          right: 20,
          zIndex: 999
        }}
      >
        <ChatIcon />
      </Fab>

      {/* Chat Bot Component */}
      {showChatBot && <ChatBot onClose={toggleChatBot} />}
    </Box>
  );
}

export default App;
