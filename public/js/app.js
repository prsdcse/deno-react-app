import React from "https://esm.sh/stable/react@19.0.0/esnext/react.mjs";
import * as ReactDOM from "https://esm.sh/stable/react-dom@19.0.0/esnext/react-dom.mjs";
import { createRoot } from "https://esm.sh/stable/react-dom@19.0.0/esnext/client.mjs";

export const renderApp = async () => {
  try {
    const { default: App } = await import("/src/App.tsx?v=" + Date.now());
    const root = document.getElementById("root");

    if (!root._reactRoot) {
      root._reactRoot = createRoot(root);
    }

    root._reactRoot.render(
      React.createElement(React.StrictMode, null, React.createElement(App))
    );
  } catch (error) {
    console.error("Error loading App:", error);
  }
};
