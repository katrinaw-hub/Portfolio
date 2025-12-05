// Central MUI theme configuration
// - Inter/system font stack.

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#005d55", 
    },
    secondary: {
      main: "#ffb300",
    },
    background: {
      default: "#f5f7fa",
    },
  },
  typography: {
    fontFamily:
      "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  custom: {
    openTitle: "#005d55",
    protectedTitle: "#ff4081",
  },
});

export default theme;