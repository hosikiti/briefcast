import { getDB, initFirebase } from "./util/firebase.ts";
import { Application, collection, getDocs, oakCors, Router } from "./deps.ts";
import { appRouter } from "./router.ts";

const DEFAULT_SERVER_PORT = 18088;

await initFirebase();

const app = new Application();

// Logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});
app.use(oakCors());

app.use(appRouter.routes());
app.use(appRouter.allowedMethods());

console.log("http server started on ", DEFAULT_SERVER_PORT);
await app.listen({ port: DEFAULT_SERVER_PORT });
