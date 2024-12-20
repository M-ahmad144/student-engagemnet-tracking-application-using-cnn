import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import {
  createBrowserRouter,
  Route,
  RouterProvider,
  createRoutesFromElements,
} from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import App from "./App.jsx";
import "./index.css";
import store from "./redux/store";

// Auth Pages
import Login from "./Pages/Auth/Login.jsx";
import Register from "./Pages/Auth/Register.jsx";

// User Pages
import Profile from "./Pages/User/Profile.jsx";

// Dashboard Pages
import HomePage from "./Pages/Dashboard/HomePage.jsx";
import Analysis from "./Pages/Dashboard/Analysis.jsx";
import StudentManagement from "./components/studentManagement.jsx";

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#f44336",
    },
    background: {
      default: "#f5f5f5", // Light gray background
    },
    text: {
      primary: "#000000", // Black text
    },
  },
});

// Create the router
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/student-management" element={<StudentManagement />} />
      <Route path="/analysis-result" element={<Analysis />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
    </Route>
  )
);

// Render the app
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* Apply global theme styling */}
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
