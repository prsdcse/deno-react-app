import { Application } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { renderApp } from "./src/ssr.tsx";

const app = new Application();
const enableSSR = Deno.env.get("ENABLE_SSR") === "true";

app.use(async (ctx) => {
  if (ctx.request.url.pathname === "/") {
    ctx.response.type = "text/html";
    if (enableSSR) {
      ctx.response.body = await renderApp();
    } else {
      ctx.response.body = await Deno.readTextFile("./index.html");
    }
  } else if (ctx.request.url.pathname === "/dist/bundle.js") {
    ctx.response.type = "application/javascript";
    ctx.response.body = await Deno.readTextFile("./dist/bundle.js");
  }
});

console.log(`Server running at http://localhost:8000 (SSR: ${enableSSR})`);
await app.listen({ port: 8000 });
