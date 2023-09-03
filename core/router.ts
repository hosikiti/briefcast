import { FeedController } from "./controller/feed.ts";
import { MediaController } from "./controller/media.ts";
import { PodcastController } from "./controller/podcast.ts";
import { Router } from "./deps.ts";

const router = new Router();

router.get("/healthcheck", (ctx) => {
  ctx.response.body = { status: "OK" };
});

router.get("/media", MediaController.get);

router.post("/podcast/trial/generate", PodcastController.trialGenerate);
router.post("/podcast/update", PodcastController.update);

router.get("/feed/content", FeedController.getContent);

export const appRouter = router;
