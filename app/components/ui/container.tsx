<!-- Import Tailwind CSS classes -->
import { styled } from '@stitches/react';

const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  backgroundColor: theme.colors.background,
  backdropFilter: 'blur(10px)',
  borderRadius: '10px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  padding: '20px',
  gap: '20px',
}));

export default Container;
