import { LanguageCode } from "../constant.ts";
import { Context, Status } from "../deps.ts";
import { RSSGenerator } from "../generator/rss_generator.ts";
import { PodcastRepository } from "../repository/podcast.ts";
import { textToMP3 } from "../tts/text_to_speech.ts";
import { getDB } from "../util/firebase.ts";
import { deleteOldTrialPodcasts } from "../util/podcast.ts";
import {
  CommonParam,
  getPostBody,
  setHttpBadRequest,
  setHttpInternalServerError,
  setHttpNotFound,
  setHttpSuccess,
} from "./base.ts";

interface TrialGenerateParam extends CommonParam {
  feedUrl: string;
  languageCode: LanguageCode;
}

interface AddPodcastParam extends CommonParam {
  feedUrl: string;
  languageCode: LanguageCode;
}

export class PodcastController {
  static async trialGenerate(ctx: Context) {
    const param = await getPostBody<TrialGenerateParam>(ctx);
    if (param == null) {
      ctx.response.status = Status.BadRequest;
      return;
    }

    const feedUrl = param["feedUrl"];
    const languageCode = param["languageCode"] || LanguageCode.enUS;
    const generator = new RSSGenerator({
      feedUrl: feedUrl,
      languageCode: languageCode,
      useCache: false,
    });
    try {
      console.log(`get feed for ${feedUrl}, ${languageCode} ... `);
      deleteOldTrialPodcasts();
      const item = await generator.getLatest();
      if (!item || item.transcript.length < 10) {
        setHttpNotFound(ctx);
        return;
      }
      console.log(item.transcript);

      console.log("summarize by gpt3 ... ");
      const briefTranscript = await generator.summarize(item);
      console.log(briefTranscript);

      if (briefTranscript.length == 0) {
        console.warn("transcript is empty, something went wrong.");
        setHttpSuccess(ctx);
        return;
      }

      const udid = "trial-" + globalThis.crypto.randomUUID();

      await textToMP3({
        text: briefTranscript,
        languageCode: languageCode,
        fileNamePrefix: udid,
      });
      setHttpSuccess(ctx, { "id": udid, "title": item.feed.title });
    } catch (e) {
      console.error(e);
      setHttpInternalServerError(ctx);
    }
  }
}
