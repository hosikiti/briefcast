import { Application, helpers, Router } from "https://deno.land/x/oak/mod.ts";

const DEFAULT_SERVER_PORT = 8088;

const app = new Application();

// Logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

const router = new Router();

router.get("/healthcheck", (ctx) => {
  ctx.response.body = { status: "OK" };
});

router.get("/", (ctx) => {
  ctx.response.body = Deno.readFileSync("html/index.html");
});

router.get("/media", (ctx) => {
  const query = helpers.getQuery(ctx);
  const filePath = query.id;
  ctx.response.body = Deno.readFileSync("media/" + filePath + ".mp3");
  console.log(query);
});

app.use(router.routes());
app.use(router.allowedMethods());

console.log("http server started on ", DEFAULT_SERVER_PORT);
await app.listen({ port: DEFAULT_SERVER_PORT });
