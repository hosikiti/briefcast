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

    for (const entry of feed.entries) {
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

    // Summarize the given text
    const { languageCode, prompt, summarizer } = this.options;

    const body = await summarizer.execute(item.transcript, languageCode, prompt);

    return intro + body + closing;
  }
}
