import React from "https://esm.sh/react@18.2.0";
import * as ReactDOM from "https://esm.sh/react-dom@18.2.0/client";

export const renderApp = async () => {
  try {
    // Dynamically import the App component
    const { default: App } = await import("/src/App.tsx?v=" + Date.now());
    const root = document.getElementById("root");

    if (!root._reactRoot) {
      root._reactRoot = ReactDOM.createRoot(root);
    }

    root._reactRoot.render(
      React.createElement(React.StrictMode, null, React.createElement(App))
    );
  } catch (error) {
    console.error("Error loading App:", error);
  }
};
