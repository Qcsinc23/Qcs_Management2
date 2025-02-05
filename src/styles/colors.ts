export const colors = {
  // Primary colors
  primary: {
    light: '#8BB8E8',  // Soft pastel blue
    main: '#5B8AD4',   // Moderate bright blue
    dark: '#2C5282',   // Deep blue
  },
  
  // Neutral colors
  neutral: {
    50: '#F9FAFB',    // Almost white
    100: '#F3F4F6',   // Very light gray
    200: '#E5E7EB',   // Light gray
    300: '#D1D5DB',   // Medium light gray
    400: '#9CA3AF',   // Medium gray
    500: '#6B7280',   // Gray
    600: '#4B5563',   // Dark gray
    700: '#374151',   // Darker gray
    800: '#1F2937',   // Very dark gray
    900: '#111827',   // Almost black
  },

  // Accent colors (pastel with moderate brightness)
  accent: {
    success: {
      light: '#A7F3D0',  // Soft mint
      main: '#34D399',   // Moderate bright green
      dark: '#059669',   // Deep green
    },
    warning: {
      light: '#FDE68A',  // Soft yellow
      main: '#FBBF24',   // Moderate bright yellow
      dark: '#D97706',   // Deep orange
    },
    error: {
      light: '#FCA5A5',  // Soft red
      main: '#EF4444',   // Moderate bright red
      dark: '#B91C1C',   // Deep red
    },
    info: {
      light: '#BFDBFE',  // Soft sky blue
      main: '#60A5FA',   // Moderate bright blue
      dark: '#2563EB',   // Deep blue
    }
  },

  // Background colors
  background: {
    default: '#FFFFFF',
    paper: '#F9FAFB',
    subtle: '#F3F4F6',
  },

  // Status colors
  status: {
    scheduled: '#60A5FA',    // Soft blue
    'in-progress': '#FBBF24', // Soft yellow
    completed: '#34D399',    // Soft green
    cancelled: '#EF4444',    // Soft red
  }
};

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
};

export const transitions = {
  default: 'all 0.2s ease-in-out',
  fast: 'all 0.1s ease-in-out',
  slow: 'all 0.3s ease-in-out',
};