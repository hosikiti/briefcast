import { gptSummarizer } from "../openai/summarizer.ts";
import { getEnglishMonthName } from "../util/date.ts";
import { isUpdatedFeed, saveFeedCache } from "./common/feed_cache.ts";
import { parseFeed } from "./common/feed_parser.ts";
import { BriefCastGenerator, BriefCastItem } from "./generator.ts";
import { GenerateOption } from "./generator_factory.ts";
import { LanguageCode, MAX_TRANSCRIPT_LENGTH } from "../constant.ts";

const feedUrl = "http://rss.cnn.com/rss/edition.rss";

export class CNNGenerator implements BriefCastGenerator {
  private _options: GenerateOption;

  get options(): GenerateOption {
    return this._options;
  }

  constructor(opts?: GenerateOption) {
    if (opts != null) {
      console.warn("this generator does not support external options.");
    }
    this._options = {
      useCache: false,
      languageCode: LanguageCode.enUS,
    };
  }

  async getLatest(): Promise<BriefCastItem | null> {
    const feed = await parseFeed(feedUrl);

    const result: string[] = [];

    if (!feed || !feed.entries) {
      return null;
    }

    for (let i = 0; i < feed.entries.length; i++) {
      const description = feed.entries[i].description;
      if (description == null) {
        continue;
      }

      if (
        result.join("\n").length + description.length > MAX_TRANSCRIPT_LENGTH
      ) {
        break;
      }
      result.push("- " + description);
    }

    let isUpdated = true;
    if (this.options.useCache) {
      isUpdated = isUpdatedFeed(feedUrl, feed);
      if (isUpdated) {
        saveFeedCache(feedUrl, feed);
      }
    }

    return {
      feed,
      isUpdated,
      transcript: result.join("\n"),
    };
  }

  async summarize(item: BriefCastItem): Promise<string> {
    // Create intro part
    const pubDate = new Date(item.feed.published!);
    const month = getEnglishMonthName(pubDate.getMonth());
    const day = pubDate.getDate();
    const year = pubDate.getFullYear();
    const intro = `Welcome to CNN news summary. Today's date is ${month}/${day}/${year}.<break time="2s"/>`;

    // Create closing part
    const closing = " That's all for today's CNN news summary by BriefCast.";

    // Summarize the given text
    // const prompt =
    //   "Make it into 150 words simple English pod cast transcription for English learners. Don't add linking words like 'meanwhile' between topics: " +
    //   item.transcript;
    const prompt = `
    Summarize this into a transcript using the following steps:
    1. Summarize each topic into a 30 words simple English pod cast transcript. 
    2. Converts into one JSON array of string until it reaches 200 bytes.
    ---
    ${item.transcript}
    `;
    const body = await gptSummarizer(item.transcript, this.options.languageCode, prompt);

    let finalTranscript = body;
    try {
      // if the results is correct JSON array, join them.
      const items = JSON.parse(body) as string[];
      finalTranscript = items.join(`<break time="2s"/>`);
    } catch (e) {}

    return intro + finalTranscript + closing;
  }
}
