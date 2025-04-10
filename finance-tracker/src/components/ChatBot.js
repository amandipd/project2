import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Typography, 
  CircularProgress,
  IconButton,
  Divider,
  Alert
} from '@mui/material';
import { Send as SendIcon, Close as CloseIcon } from '@mui/icons-material';

const ChatBot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { 
      text: "Hello! I'm your financial assistant. I can help you understand your spending habits and provide financial advice based on your transactions. How can I help you today?", 
      sender: 'bot' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message to chat
    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      console.log('Sending request to server...');
      // Call the backend API
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server error:', errorData);
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      
      // Add bot response to chat
      setMessages(prev => [...prev, { text: data.response, sender: 'bot' }]);
    } catch (error) {
      console.error('Detailed error:', error);
      setError(error.message || 'Connection error');
      setMessages(prev => [...prev, { 
        text: "Sorry, I'm having trouble connecting to the server. Please try again later.", 
        sender: 'bot' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        position: 'fixed', 
        bottom: 20, 
        right: 20, 
        width: 350, 
        height: 500, 
        display: 'flex', 
        flexDirection: 'column',
        zIndex: 1000
      }}
    >
      {/* Chat header */}
      <Box sx={{ 
        p: 2, 
        bgcolor: '#1976d2', 
        color: 'white', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <Typography variant="h6">Financial Assistant</Typography>
        <IconButton color="inherit" onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Divider />
      
      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mx: 2, mt: 2 }}>
          {error}
        </Alert>
      )}
      
      {/* Messages area */}
      <Box sx={{ 
        flexGrow: 1, 
        overflow: 'auto', 
        p: 2, 
        display: 'flex', 
        flexDirection: 'column',
        gap: 2
      }}>
        {messages.map((message, index) => (
          <Box 
            key={index} 
            sx={{ 
              alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%'
            }}
          >
            <Paper 
              elevation={1} 
              sx={{ 
                p: 1.5, 
                bgcolor: message.sender === 'user' ? '#e3f2fd' : '#f5f5f5',
                borderRadius: 2
              }}
            >
              <Typography variant="body1">{message.text}</Typography>
            </Paper>
          </Box>
        ))}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>
      
      <Divider />
      
      {/* Input area */}
      <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          size="small"
          multiline
          maxRows={3}
        />
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          sx={{ minWidth: 40 }}
        >
          <SendIcon />
        </Button>
      </Box>
    </Paper>
  );
};

export default ChatBot; 