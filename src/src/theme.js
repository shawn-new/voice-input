import { red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
  palette: {
    mode: 'dark', // Set the theme mode to light or dark
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
    overrides: {
      MuiLinearProgress: {
        root: {
          height: 10, // Customize the height of the progress bar
          borderRadius: 5, // Customize the border radius of the progress bar
        },
      },
    },
  },
});

export default theme;