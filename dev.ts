import * as esbuild from "https://deno.land/x/esbuild@v0.19.12/mod.js";
import { Application } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { renderApp } from "./src/ssr.tsx";

const app = new Application();
const isBuildOnly = Deno.args.includes("--build");
const enableSSR = Deno.env.get("ENABLE_SSR") === "true";

// Build the application
await esbuild.build({
  entryPoints: ["./src/main.tsx"],
  bundle: true,
  outfile: "./dist/bundle.js",
  format: "esm",
  platform: "browser",
  jsx: "automatic",
  loader: {
    ".tsx": "tsx",
    ".ts": "tsx",
  },
});

if (!isBuildOnly) {
  // Serve static files
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

  console.log(
    `Development server running at http://localhost:8000 (SSR: ${enableSSR})`
  );
  await app.listen({ port: 8000 });
}

// Cleanup esbuild
esbuild.stop();

if (isBuildOnly) {
  Deno.exit(0);
}
