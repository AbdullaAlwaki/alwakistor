import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import { deepPurple, teal } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: deepPurple,
    secondary: teal,
    mode: 'dark',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '12px 24px',
          transition: 'all 0.3s ease',
        },
      },
    },
  },
});

export const DesignProvider = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      {children}
    </div>
  </ThemeProvider>
);