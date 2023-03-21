import { MediaController } from "./controller/media.ts";
import { PodcastController } from "./controller/podcast.ts";
import { collection, getDocs, Router } from "./deps.ts";
import { getDB } from "./util/firebase.ts";

const router = new Router();

router.get("/healthcheck", (ctx) => {
  ctx.response.body = { status: "OK" };
});

router.get("/media", MediaController.get);

router.post("/podcast/trial/generate", PodcastController.trialGenerate);

router.post("/podcast/add", PodcastController.add);

export const appRouter = router;
