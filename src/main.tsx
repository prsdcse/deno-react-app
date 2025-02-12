import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

// Only run in browser environment
if (typeof document !== "undefined") {
  const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
  );
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
