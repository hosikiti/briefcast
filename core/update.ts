import { getDB, initFirebase } from "./util/firebase.ts";
import { PodcastRepository } from "./repository/podcast.ts";
import { SummarizerRepository } from "./repository/summarizer.ts";

// This is a batch command to update specific site feeds

async function main() {
  await initFirebase();
  const summarizerRepo = new SummarizerRepository(getDB());
  const podcastRepo = new PodcastRepository(getDB(), summarizerRepo);

  const limit = 1000;
  let offsetCursor = "";

  while (true) {
    const podcasts = await podcastRepo.getPodcastsForAllUsers(limit, offsetCursor);
    for (const pod of podcasts) {
      try {
        await podcastRepo.generate(pod);
      } catch (e) {
        console.error(`failed to generate, ${e}`);
      }
    }
    if (podcasts.length < limit) {
      break;
    }
    offsetCursor = podcasts[podcasts.length - 1].authorId!;
  }
  await summarizerRepo.removeOldCaches(30);
  Deno.exit();
}

main();
