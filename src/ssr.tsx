import React from "react";
import ReactDOMServer from "https://esm.sh/react-dom@18.2.0/server";
import App from "./App.tsx";

export async function renderApp() {
  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  const template = await Deno.readTextFile("./index.html");
  return template.replace(
    '<div id="root"></div>',
    `<div id="root">${html}</div>`
  );
}
