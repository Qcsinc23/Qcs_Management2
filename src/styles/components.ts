import { styled } from '@mui/material/styles';
import { 
  Card,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Chip
} from '@mui/material';
import { colors, shadows, transitions } from './colors';

export const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: colors.background.paper,
  borderRadius: '12px',
  boxShadow: shadows.md,
  transition: transitions.default,
  '&:hover': {
    boxShadow: shadows.lg,
  },
  padding: theme.spacing(3),
}));

export const StyledForm = styled('form')(({ theme }) => ({
  '& .MuiTextField-root': {
    marginBottom: theme.spacing(2),
    '& .MuiOutlinedInput-root': {
      transition: transitions.default,
      '&:hover fieldset': {
        borderColor: colors.primary.light,
      },
      '&.Mui-focused fieldset': {
        borderColor: colors.primary.main,
      },
    },
  },
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  padding: '8px 24px',
  textTransform: 'none',
  fontWeight: 600,
  transition: transitions.default,
  '&.MuiButton-contained': {
    backgroundColor: colors.primary.main,
    color: colors.background.default,
    '&:hover': {
      backgroundColor: colors.primary.dark,
    },
  },
  '&.MuiButton-outlined': {
    borderColor: colors.primary.main,
    color: colors.primary.main,
    '&:hover': {
      backgroundColor: colors.primary.light + '10',
    },
  },
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: colors.background.default,
    borderRadius: '8px',
    transition: transitions.default,
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: colors.primary.light,
      },
    },
  },
  '& .MuiInputLabel-root': {
    color: colors.neutral[600],
  },
}));

export const StyledSection = styled(Box)(({ theme }) => ({
  backgroundColor: colors.background.subtle,
  borderRadius: '12px',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

export const StyledTitle = styled(Typography)(({ theme }) => ({
  color: colors.neutral[900],
  fontWeight: 600,
  marginBottom: theme.spacing(3),
}));

export const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: colors.neutral[600],
  transition: transitions.fast,
  '&:hover': {
    backgroundColor: colors.neutral[100],
    color: colors.primary.main,
  },
  '&.Mui-disabled': {
    color: colors.neutral[300],
  },
}));

export const StyledStatusChip = styled(Chip)(({ theme }) => ({
  borderRadius: '6px',
  fontWeight: 500,
  '&.MuiChip-filled': {
    '&.status-scheduled': {
      backgroundColor: colors.status.scheduled + '20',
      color: colors.status.scheduled,
    },
    '&.status-in-progress': {
      backgroundColor: colors.status['in-progress'] + '20',
      color: colors.status['in-progress'],
    },
    '&.status-completed': {
      backgroundColor: colors.status.completed + '20',
      color: colors.status.completed,
    },
    '&.status-cancelled': {
      backgroundColor: colors.status.cancelled + '20',
      color: colors.status.cancelled,
    },
  },
}));

export const StyledDataGrid = styled(Box)(({ theme }) => ({
  '& .MuiDataGrid-root': {
    border: 'none',
    backgroundColor: colors.background.default,
    '& .MuiDataGrid-cell': {
      borderColor: colors.neutral[200],
    },
    '& .MuiDataGrid-columnHeaders': {
      backgroundColor: colors.background.subtle,
      borderBottom: `1px solid ${colors.neutral[200]}`,
    },
    '& .MuiDataGrid-footerContainer': {
      borderTop: `1px solid ${colors.neutral[200]}`,
    },
  },
}));

export const StyledFormSection = styled(Box)(({ theme }) => ({
  backgroundColor: colors.background.paper,
  borderRadius: '12px',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  boxShadow: shadows.sm,
  '&:hover': {
    boxShadow: shadows.md,
  },
  transition: transitions.default,
}));