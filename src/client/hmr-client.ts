const connectHMR = () => {
  const ws = new WebSocket("ws://localhost:8001");

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "reload") {
      console.log("HMR: Reloading page...");
      window.location.reload();
    }
  };

  ws.onclose = () => {
    console.log("HMR: Connection closed. Retrying...");
    setTimeout(connectHMR, 1000);
  };
};

if (import.meta.env?.DEV) {
  connectHMR();
}
