import { handler } from "./frontend/build/handler.js";
import { PodcastController } from "./controller/podcast.ts";
import { MediaController } from "./controller/media.ts";
import { getDB, initFirebase } from "./util/firebase.ts";
import { Application, collection, getDocs, oakCors, Router } from "./deps.ts";

const DEFAULT_SERVER_PORT = 8088;

await initFirebase();

const app = new Application();

const router = new Router();

router.get("/healthcheck", (ctx) => {
  ctx.response.body = { status: "OK" };
});

router.get("/media", MediaController.get);

router.post("/podcast/trial/generate", PodcastController.trialGenerate);

router.get("/testvalues", async (ctx) => {
  const querySnapshot = await getDocs(collection(getDB(), "playlists"));
  const records: string[] = [];
  querySnapshot.forEach((doc) => {
    records.push(`${doc.id}`);
  });
  ctx.response.body = records.join("\n");
});

// Logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

// let SvelteKit handle everything else, including serving prerendered pages and static assets
app.use(handler);

console.log("http server started on ", DEFAULT_SERVER_PORT);
await app.listen({ port: DEFAULT_SERVER_PORT });
