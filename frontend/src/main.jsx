import React from "react";
import ReactDOM from "react-dom/client";

import "./styles/layout.css";
import "./styles/dashboard.css";
import "./styles/form.css";
import "./styles/table.css";
import "./styles/auth.css";

import App from "./App";

import "./index.css";

import {
  AuthProvider
} from "./context/AuthContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);