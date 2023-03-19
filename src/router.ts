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

router.get("/testvalues", async (ctx) => {
  const querySnapshot = await getDocs(collection(getDB(), "playlists"));
  const records: string[] = [];
  querySnapshot.forEach((doc) => {
    records.push(`${doc.id}`);
  });
  ctx.response.body = records.join("\n");
});

export const appRouter = router;
