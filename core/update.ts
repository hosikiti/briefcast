import { BriefCastGeneratorFactory, GenerateOption } from "./generator/generator_factory.ts";
import { textToMP3 } from "./tts/text_to_speech.ts";
import { getDB, initFirebase } from "./util/firebase.ts";
import { PodcastRepository } from "./repository/podcast.ts";
import { PodcastDefinition } from "./types.ts";
import { SummarizerRepository } from "./repository/summarizer.ts";
import { getSHA256String } from "./util/hash.ts";

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
  Deno.exit();
}

main();
