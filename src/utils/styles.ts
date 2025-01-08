import { CSSProperties } from 'react';
import { getCurrentNonce } from '../middleware';

export const createStyledElement = (styles: CSSProperties) => {
  const nonce = getCurrentNonce();
  return {
    style: styles,
    nonce: nonce
  };
};

// Common styles
export const commonStyles = {
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5'
  },
  loadingContent: {
    textAlign: 'center',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
  },
  errorContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px'
  },
  errorContent: {
    textAlign: 'center',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    maxWidth: '600px'
  },
  errorHeading: {
    color: '#d32f2f'
  },
  errorMessage: {
    marginBottom: '20px'
  },
  errorPre: {
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '4px',
    textAlign: 'left',
    overflow: 'auto',
    margin: '0 auto',
    maxWidth: '100%'
  },
  errorFooter: {
    marginTop: '20px',
    fontSize: '0.9em',
    color: '#666'
  }
} as const;
