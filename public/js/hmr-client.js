export const connectHMR = () => {
  const ws = new WebSocket("ws://localhost:8001");

  ws.onmessage = async (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "reload") {
      console.log(`HMR: File changed ${data.path}`);

      if (data.path.endsWith(".tsx") || data.path.endsWith(".ts")) {
        // For React components, re-render without full page reload
        const { renderApp } = await import("./app.js");
        renderApp();
      } else {
        // For other files, do a full page reload
        window.location.reload();
      }
    }
  };

  ws.onclose = () => {
    console.log("HMR: Connection closed. Retrying...");
    setTimeout(connectHMR, 1000);
  };
};
