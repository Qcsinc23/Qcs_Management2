import React from 'react';
import ReactDOM from 'react-dom/client';
import { Box, CircularProgress, Typography } from '@mui/material';
import App from './App';
import './index.css';
import { CSP_HEADERS, applySecurityHeaders } from './middleware';

// Apply security headers to document
Object.entries(CSP_HEADERS).forEach(([header, value]) => {
  const meta = document.createElement('meta');
  meta.httpEquiv = header;
  meta.content = value;
  document.head.appendChild(meta);
});

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            p: 3,
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" color="error" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {this.state.error?.message || 'An unexpected error occurred'}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: '#1976d2',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              Reload Page
            </button>
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
