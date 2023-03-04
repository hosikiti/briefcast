import { BriefCastGenerator, BriefCastItem } from "../generator.ts";
import { GenerateOption } from "../generator_factory.ts";
import { gptSummarizer } from "../openai/summarizer.ts";
import { isUpdatedFeed, saveFeedCache } from "./common/feed_cache.ts";
import { parseFeed } from "./common/feed_parser.ts";

const feedUrl = "https://www.nhk.or.jp/rss/news/cat0.xml";

export class NHKGenerator implements BriefCastGenerator {
  private options: GenerateOption;

  constructor(opts?: GenerateOption) {
    this.options = opts || {
      useCache: true,
    };
  }

  getLanguageCode(): string {
    return "ja-JP";
  }

  async getLatest(): Promise<BriefCastItem> {
    const feed = await parseFeed(feedUrl);
    const result: string[] = [];

    feed.channel.item.forEach((item) => {
      result.push("・" + item.description);
    });

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
    const now = new Date(item.feed.channel.lastBuildDate);
    const greeting = now.getFullYear() + "年" + (now.getMonth() + 1) + "月" +
      now.getDate() + "日のニュースです。";

    return greeting +
      await gptSummarizer(item.transcript, this.getLanguageCode()) +
      " 以上、NHKニュースをBriefCastが要約してお伝えしました。";
  }
}
