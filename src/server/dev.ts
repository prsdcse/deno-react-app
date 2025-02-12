import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { transform } from "https://deno.land/x/esbuild@v0.19.4/mod.js";
import {
  WebSocket,
  WebSocketServer,
} from "https://deno.land/x/websocket/mod.ts";

const app = new Application();
const router = new Router();
const wss = new WebSocketServer(8001);

// HMR WebSocket handling
wss.on("connection", (ws: WebSocket) => {
  console.log("Client connected to HMR");

  const watcher = Deno.watchFs("./src");

  (async () => {
    try {
      for await (const event of watcher) {
        if (event.kind === "modify") {
          console.log(`File ${event.paths[0]} has been modified`);
          ws.send(
            JSON.stringify({
              type: "reload",
              path: event.paths[0],
            })
          );
        }
      }
    } catch (error) {
      console.error("Watcher error:", error);
    }
  })();

  ws.on("close", () => {
    console.log("Client disconnected from HMR");
    try {
      watcher.close();
    } catch (e) {
      console.error("Error closing watcher:", e);
    }
  });
});

// Common web files that might be requested by browsers
const COMMON_WEB_FILES = new Set([
  "/robots.txt",
  "/favicon.ico",
  "/site.webmanifest",
]);

// Add middleware for handling TypeScript files
app.use(async (ctx, next) => {
  if (
    ctx.request.url.pathname.endsWith(".tsx") ||
    ctx.request.url.pathname.endsWith(".ts")
  ) {
    ctx.response.headers.set("Content-Type", "application/javascript");
    ctx.response.headers.set("Access-Control-Allow-Origin", "*");

    try {
      const filePath = `${Deno.cwd()}${ctx.request.url.pathname}`;
      const fileContent = await Deno.readTextFile(filePath);

      // Transform TypeScript/JSX to JavaScript
      const result = await transform(fileContent, {
        loader: "tsx",
        jsxImportSource: "react",
        format: "esm",
        target: "es2020",
        sourcefile: ctx.request.url.pathname,
        jsxFactory: "React.createElement",
        jsxFragment: "React.Fragment",
        define: {
          "process.env.NODE_ENV": '"development"',
        },
      });

      // Add React import only if it's not already in the code
      const finalCode = !fileContent.includes("import React")
        ? `import React from "https://esm.sh/react@18.2.0";\n${result.code}`
        : result.code;

      ctx.response.body = finalCode;
    } catch (err) {
      console.error("Error serving TypeScript file:", err);
      await next();
    }
    return;
  }
  await next();
});

// Serve static files
app.use(async (ctx, next) => {
  try {
    await ctx.send({
      root: `${Deno.cwd()}/public`,
      index: "index.html",
    });
  } catch (err) {
    // Ignore 404s for common web files
    if (
      err instanceof Error &&
      err.name === "NotFoundError" &&
      COMMON_WEB_FILES.has(ctx.request.url.pathname)
    ) {
      ctx.response.status = 404;
      return;
    }
    console.error("Error serving static file:", err);
    await next();
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

console.log("Development server running on http://localhost:8000");
await app.listen({ port: 8000 });
