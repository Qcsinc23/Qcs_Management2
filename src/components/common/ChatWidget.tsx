import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Fab,
  Collapse,
  CircularProgress,
  useTheme,
} from '@mui/material';
import {
  Chat as ChatIcon,
  Send as SendIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Support as SupportIcon,
} from '@mui/icons-material';
import useStore from '../../store/useStore';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const INITIAL_BOT_MESSAGE = {
  id: '1',
  text: 'Hello! How can I help you today?',
  sender: 'bot' as const,
  timestamp: new Date(),
};

export default function ChatWidget() {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_BOT_MESSAGE]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addNotification } = useStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Math.random().toString(36).substring(7),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    try {
      // Simulate bot response
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simple bot responses based on keywords
      let botResponse = 'I\'m not sure how to help with that. Could you please rephrase your question?';

      const lowerCaseMessage = newMessage.toLowerCase();
      if (lowerCaseMessage.includes('track')) {
        botResponse = 'You can track your package by clicking the "Track Package" button in the navigation bar and entering your tracking number.';
      } else if (lowerCaseMessage.includes('book') || lowerCaseMessage.includes('shipping')) {
        botResponse = 'To book a delivery, click the "Book Now" button and follow our simple booking process. Need help with specific details?';
      } else if (lowerCaseMessage.includes('payment')) {
        botResponse = 'We accept all major credit cards and offer split payment options. Having trouble with payment? Let me know the specific issue.';
      } else if (lowerCaseMessage.includes('contact')) {
        botResponse = 'You can reach our customer service at 1-800-XXX-XXXX or email support@qcs.com. Would you like me to connect you with a representative?';
      }

      const botMessage: Message = {
        id: Math.random().toString(36).substring(7),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      addNotification({
        message: 'Failed to get response. Please try again.',
        type: 'error',
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <Fab
        color="primary"
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </Fab>

      <Collapse
        in={isOpen}
        sx={{
          position: 'fixed',
          bottom: 90,
          right: 24,
          zIndex: 1000,
          maxWidth: 360,
          width: '100%',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            height: 480,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              p: 2,
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <SupportIcon />
            <Typography variant="h6">Help Center</Typography>
          </Box>

          <List
            sx={{
              flex: 1,
              overflow: 'auto',
              p: 2,
              backgroundColor: theme.palette.grey[50],
            }}
          >
            {messages.map((message) => (
              <ListItem
                key={message.id}
                sx={{
                  flexDirection: 'column',
                  alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  padding: 0,
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 0.5,
                  }}
                >
                  {message.sender === 'bot' ? (
                    <SupportIcon fontSize="small" color="primary" />
                  ) : (
                    <PersonIcon fontSize="small" color="action" />
                  )}
                  <Typography variant="caption" color="text.secondary">
                    {message.timestamp.toLocaleTimeString()}
                  </Typography>
                </Box>
                <Paper
                  elevation={1}
                  sx={{
                    p: 1.5,
                    maxWidth: '80%',
                    backgroundColor:
                      message.sender === 'user'
                        ? theme.palette.primary.main
                        : theme.palette.background.paper,
                    color:
                      message.sender === 'user'
                        ? theme.palette.primary.contrastText
                        : theme.palette.text.primary,
                  }}
                >
                  <Typography variant="body2">{message.text}</Typography>
                </Paper>
              </ListItem>
            ))}
            {isTyping && (
              <ListItem sx={{ justifyContent: 'flex-start' }}>
                <CircularProgress size={20} />
              </ListItem>
            )}
            <div ref={messagesEndRef} />
          </List>

          <Box sx={{ p: 2, backgroundColor: theme.palette.background.paper }}>
            <TextField
              fullWidth
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              multiline
              maxRows={3}
              variant="outlined"
              size="small"
              InputProps={{
                endAdornment: (
                  <IconButton
                    color="primary"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || isTyping}
                  >
                    <SendIcon />
                  </IconButton>
                ),
              }}
            />
          </Box>
        </Paper>
      </Collapse>
    </>
  );
}