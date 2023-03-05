import { gptSummarizer } from "../openai/summarizer.ts";
import { getEnglishMonthName } from "../util/date.ts";
import { isUpdatedFeed, saveFeedCache } from "./common/feed_cache.ts";
import { parseFeed } from "./common/feed_parser.ts";
import { BriefCastGenerator, BriefCastItem } from "./generator.ts";
import { GenerateOption } from "./generator_factory.ts";
import { MAX_TRANSCRIPT_LENGTH } from "../constant.ts";

export class RSSGenerator implements BriefCastGenerator {
  options: GenerateOption;
  constructor(opts: GenerateOption) {
    this.options = opts;
  }

  async getLatest(): Promise<BriefCastItem> {
    const feedUrl = this.options.feedUrl!;
    const feed = await parseFeed(feedUrl);

    const result: string[] = [];

    for (let i = 0; i < feed.channel.item.length; i++) {
      const description = feed.channel.item[i].description;
      if (description == null) {
        continue;
      }

      if (
        result.join("\n").length + description.length > MAX_TRANSCRIPT_LENGTH
      ) {
        break;
      }
      result.push(description);
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
    // const pubDate = new Date(item.feed.channel.lastBuildDate);
    // const month = getEnglishMonthName(pubDate.getMonth());
    // const day = pubDate.getDate();
    // const year = pubDate.getFullYear();
    // const intro = `Today's date is ${month}/${day}/${year}.`;

    // // Create closing part
    // const closing = " That's all for today by BriefCast.";

    // // Summarize the given text
    // const prompt =
    //   "Make it into 150 words simple English pod cast transcription for English learners. Don't add linking words like 'meanwhile' between topics: " +
    //   item.transcript;
    const body = await gptSummarizer(item.transcript, this.options.languageCode);

    return body;
    // return intro + body + closing;
  }
}
