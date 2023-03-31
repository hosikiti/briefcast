import { MediaController } from "./controller/media.ts";
import { PodcastController } from "./controller/podcast.ts";
import { Router } from "./deps.ts";

const router = new Router();

router.get("/healthcheck", (ctx) => {
  ctx.response.body = { status: "OK" };
});

router.get("/media", MediaController.get);

router.post("/podcast/trial/generate", PodcastController.trialGenerate);

export const appRouter = router;
