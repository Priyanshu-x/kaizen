import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { JournalProvider } from "./context/JournalContext.jsx";
import { TransactionProvider } from "./context/TransactionContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <TransactionProvider>
        <JournalProvider>
          <App />
        </JournalProvider>
      </TransactionProvider>
    </ThemeProvider>
  </React.StrictMode>
);