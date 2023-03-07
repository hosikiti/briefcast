import { Context } from "../deps.ts";
import { RSSGenerator } from "../generator/rss_generator.ts";
import { textToMP3 } from "../tts/text_to_speech.ts";
import { deleteOldTrialPodcasts } from "../util/podcast.ts";

export class PodcastController {
  static trialGenerate = async (ctx: Context) => {
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
      deleteOldTrialPodcasts();
      const item = await generator.getLatest();
      if (!item || item.transcript.length < 10) {
        ctx.response.status = 404;
        return;
      }
      console.log(item.transcript);

      console.log("summarize by gpt3 ... ");
      const briefTranscript = await generator.summarize(item);
      console.log(briefTranscript);

      if (briefTranscript.length == 0) {
        console.warn("transcript is empty, something went wrong.");
        ctx.response.status = 500;
        return;
      }

      const udid = "trial-" + globalThis.crypto.randomUUID();

      await textToMP3({
        text: briefTranscript,
        languageCode: languageCode,
        fileNamePrefix: udid,
      });
      ctx.response.body = { "id": udid, "title": item.feed.title };
    } catch (e) {
      console.error(e);
      ctx.response.status = 500;
    }
  };
}
