import { RSSGenerator } from "./generator/rss_generator.ts";
import { Application, helpers, httpErrors, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { handler } from "./frontend/build/handler.js";
import { textToMP3 } from "./tts/text_to_speech.ts";
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

router.get("/media", (ctx) => {
  const query = helpers.getQuery(ctx);
  const filePath = query.id;
  ctx.response.body = Deno.readFileSync("media/" + filePath + ".mp3");
});

router.post("/createTrialPodCast", async (ctx) => {
  const body = ctx.request.body();
  if (body.type != "json") {
    ctx.response.status = 400;
    return;
  }
  const param = await body.value;

  const feedUrl = param["feedUrl"];
  const languageCode = param["languageCode"] || "en-US";
  const generator = new RSSGenerator({
    feedUrl: feedUrl,
    languageCode: languageCode,
    useCache: false,
  });
  try {
    console.log(`get feed for ${feedUrl} ... `);
    const item = await generator.getLatest();
    console.log(item.transcript);

    console.log("summarize by gpt3 ... ");
    const briefTranscript = await generator.summarize(item);
    console.log(briefTranscript);

    if (briefTranscript.length == 0) {
      console.warn("transcript is empty, something went wrong.");
      return;
    }

    const udid = (+new Date()) + "";

    await textToMP3({
      text: briefTranscript,
      languageCode: languageCode,
      fileNamePrefix: udid,
    });
    ctx.response.body = { "id": udid };
  } catch (e) {
    console.error(e);
    ctx.response.status = 500;
  }
});

app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

// let SvelteKit handle everything else, including serving prerendered pages and static assets
app.use(handler);

console.log("http server started on ", DEFAULT_SERVER_PORT);
await app.listen({ port: DEFAULT_SERVER_PORT });
