import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./Context/AuthProvider";
import { SocketProvider } from "./Context/SocketContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <Router>
      <AuthProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </AuthProvider>
    </Router>
  </>
);
