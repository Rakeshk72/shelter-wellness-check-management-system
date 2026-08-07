// Import StrictMode from React.
import { StrictMode } from "react";

// Import createRoot to render the React application.
import { createRoot } from "react-dom/client";

// Import BrowserRouter to enable React Router navigation.
import { BrowserRouter } from "react-router-dom";

// Import global styles.
import "./index.css";

// Import the main App component.
import App from "./App.jsx";

// Render the React application.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);