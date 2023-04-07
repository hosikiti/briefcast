import { BriefCastGeneratorFactory, GenerateOption } from "./generator/generator_factory.ts";
import { textToMP3 } from "./tts/text_to_speech.ts";
import { getDB, initFirebase } from "./util/firebase.ts";
import { PodcastRepository } from "./repository/podcast.ts";
import { PodcastDefinition } from "./types.ts";
import { SummarizerRepository } from "./repository/summarizer.ts";
import { getSHA256String } from "./util/hash.ts";
import { logger } from "./util/logger.ts";

// This is a batch command to update specific site feeds

async function generate(
  pod: PodcastDefinition,
  summarizer: SummarizerRepository,
): Promise<string | null> {
  const opts: GenerateOption = {
    useCache: true,
    languageCode: pod.language,
    feedUrl: pod.feedUrl,
    prompt: pod.prompt,
    summarizer: summarizer,
  };
  const generator = BriefCastGeneratorFactory(opts);
  console.log(`get feed for ${pod.feedUrl} ... `);
  const item = await generator.getLatest();
  if (!item) {
    console.log(`failed to get the feed. SKIP.`);
    return null;
  }
  console.log(item.content);

  console.log("summarize by gpt3 ... ");
  const transcript = await generator.summarize(item);
  console.log(transcript);
  console.log(transcript.length);

  if (transcript.length == 0) {
    console.warn("transcript is empty, something went wrong.");
    return null;
  }

  // generate MP3 hash
  const mp3Hash = getSHA256String(`${transcript}:${pod.prompt}:${pod.language}`);

  if (pod.lastContentHash == mp3Hash) {
    console.warn("mp3 content is same, so skip generation.");
    return null;
  }

  console.log(`export to ${pod.docId}.mp3 ...`);
  await textToMP3({
    text: transcript,
    languageCode: generator.options.languageCode,
    outDir: pod.authorId,
    fileNamePrefix: pod.docId,
  });
  return mp3Hash;
}

async function main() {
  await initFirebase();
  const podcastRepo = new PodcastRepository(getDB());
  const summarizerRepo = new SummarizerRepository(getDB());

  const limit = 1000;
  let offsetCursor = "";

  while (true) {
    const podcasts = await podcastRepo.getPodcastsForAllUsers(limit, offsetCursor);
    for (const pod of podcasts) {
      try {
        const contentHash = await generate(pod, summarizerRepo);
        if (contentHash) {
          await podcastRepo.updateLastGeneratedDate(pod.authorId, pod.docId, contentHash);
        }
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
