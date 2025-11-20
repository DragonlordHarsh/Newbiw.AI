import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Diagnostic check: Prints to the screen if App.tsx failed to import
if (!App) {
  document.body.innerHTML = "<div style='color:red; font-size: 30px; padding: 20px;'>FATAL ERROR: App.tsx not found or failed to export.</div>";
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const root = ReactDOM.createRoot(rootElement);

try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (err) {
  // This will show you the specific error if React crashes
  rootElement.innerHTML = `<div style="color:red; padding: 20px;">
    <h1>Application Crashed</h1>
    <pre>${err.toString()}</pre>
  </div>`;
}