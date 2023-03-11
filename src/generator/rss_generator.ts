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

  async getLatest(): Promise<BriefCastItem | null> {
    const feedUrl = this.options.feedUrl!;
    const feed = await parseFeed(feedUrl);
    const result: string[] = [];

    if (!feed?.entries) {
      return null;
    }

    for (let i = 0; i < feed.entries.length; i++) {
      const entry = feed.entries[i];
      let content = entry.description || "";
      if (content.length == 0) {
        content = entry.title || "";
      }

      if (content.length == 0) {
        continue;
      }

      if (
        result.join("\n").length + content.length > MAX_TRANSCRIPT_LENGTH
      ) {
        break;
      }
      result.push("- " + content);
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
    let intro = `This is from ${item.feed.title}. `;
    if (this.options.languageCode == "ja-JP") {
      intro = item.feed.title + "からお伝えします。";
    }
    // const pubDate = new Date(item.feed.channel.lastBuildDate);
    // const month = getEnglishMonthName(pubDate.getMonth());
    // const day = pubDate.getDate();
    // const year = pubDate.getFullYear();
    // const intro = `Today's date is ${month}/${day}/${year}.`;

    // Create closing part
    let closing = " That's all for today by BriefCast.";
    if (this.options.languageCode == "ja-JP") {
      closing = " 以上、BriefCastがお伝えしました。";
    }

    // // Summarize the given text
    // const prompt =
    //   "Make it into 150 words simple English pod cast transcription for English learners. Don't add linking words like 'meanwhile' between topics: " +
    //   item.transcript;
    const body = await gptSummarizer(item.transcript, this.options.languageCode);

    return intro + body + closing;
    // return intro + body + closing;
  }
}
