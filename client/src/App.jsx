// Root app component:
// - Wraps MainRouter in React Router + MUI ThemeProvider
// - Applies CssBaseline for consistent styling.

import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MainRouter from "./MainRouter.jsx";
import theme from "./theme.js";

const App = () => (
  <Router>
    <ThemeProvider theme={theme}>
      {/* CssBaseline resets browser defaults for a cleaner UI */}
      <CssBaseline />
      <MainRouter />
    </ThemeProvider>
  </Router>
);

export default App;