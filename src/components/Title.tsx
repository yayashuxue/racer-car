import { Box, styled } from '@mui/material';

export const Title = styled(Box)(({ theme }) => ({
  zIndex: 1,
  position: 'relative',
  fontSize: '32px',
  display: 'inline',
  '::before': {
    background: theme.palette.mode === 'light' ? '#6999FF' : '#0052FF',
    top: '50%',
    left: '10%',
    content: '""',
    width: '100%',
    height: '50%',
    position: 'absolute',
    transform: 'translateY(-50%)',
    zIndex: -1,
  },
  color: theme.palette.text.primary,
}));
