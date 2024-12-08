import React from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./Pages/HomePage";
import Analysis from "./Pages/Analysis";

// Optional: Create your MUI theme if needed
const theme = createTheme({
  palette: {
    primary: {
      main: "#2980B9",
    },
    secondary: {
      main: "#F39C12",
    },
    background: {
      default: "#1D1F2E",
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analysis-result" element={<Analysis />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
