import { BriefCastGeneratorFactory, GenerateOption } from "./generator/generator_factory.ts";
import { textToMP3 } from "./tts/text_to_speech.ts";
import { getDB, initFirebase } from "./util/firebase.ts";
import { PodcastRepository } from "./repository/podcast.ts";
import { PodcastDefinition } from "./types.ts";
import { SummarizerRepository } from "./repository/summarizer.ts";

// This is a batch command to update specific site feeds

async function generate(pod: PodcastDefinition, summarizer: SummarizerRepository): Promise<boolean> {
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
    return false;
  }
  console.log(item.transcript);

  console.log("summarize by gpt3 ... ");
  const briefTranscript = await generator.summarize(item);
  console.log(briefTranscript);
  console.log(briefTranscript.length);

  if (briefTranscript.length == 0) {
    console.warn("transcript is empty, something went wrong.");
    return false;
  }

  console.log(`export to ${pod.docId}.mp3 ...`);
  await textToMP3({
    text: briefTranscript,
    languageCode: generator.options.languageCode,
    outDir: pod.authorId,
    fileNamePrefix: pod.docId,
  });
  return true;
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
      const isGenerated = await generate(pod, summarizerRepo);
      if (isGenerated) {
        await podcastRepo.updateLastGeneratedDate(pod.authorId, pod.docId);
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
