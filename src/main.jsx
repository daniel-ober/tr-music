import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";

import "./index.css";
import "./styles/global.css";
import "./styles/app.css"; // ✅ REQUIRED for .app-stage backdrop + glow

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);