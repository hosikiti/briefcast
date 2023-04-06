import { getDB, initFirebase } from "./util/firebase.ts";
import { Application, collection, getDocs, oakCors, Router } from "./deps.ts";
import { appRouter } from "./router.ts";
import { logger } from "./util/logger.ts";

const DEFAULT_SERVER_PORT = 18088;

await initFirebase();

const app = new Application();

// Logger
app.use(async (ctx, next) => {
  await next();
  const { ip } = ctx.request;
  const clientAdcress = ctx.request.headers.get("x-forwarded-for") || ip;
  const userAgent = ctx.request.headers.get("user-agent");

  logger.info(
    `${clientAdcress},  ${ctx.request.method} ${ctx.request.url} ${userAgent}`,
  );
});
app.use(oakCors());

app.use(appRouter.routes());
app.use(appRouter.allowedMethods());

logger.info("http server started on ", DEFAULT_SERVER_PORT);
await app.listen({ port: DEFAULT_SERVER_PORT });
