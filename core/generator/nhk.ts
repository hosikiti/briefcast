import { LanguageCode } from "../constant.ts";
import { gptSummarizer } from "../openai/summarizer.ts";
import { isUpdatedFeed, saveFeedCache } from "./common/feed_cache.ts";
import { parseFeed } from "./common/feed_parser.ts";
import { BriefCastGenerator, BriefCastItem } from "./generator.ts";
import { GenerateOption } from "./generator_factory.ts";

const feedUrl = "https://www.nhk.or.jp/rss/news/cat0.xml";

export class NHKGenerator implements BriefCastGenerator {
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
      languageCode: LanguageCode.jaJP,
    };
  }

  async getLatest(): Promise<BriefCastItem | null> {
    const feed = await parseFeed(feedUrl);
    const result: string[] = [];

    if (!feed || !feed.entries) {
      return null;
    }

    feed.entries.forEach((entry) => {
      result.push("・" + entry.description);
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
    const now = new Date(item.feed.published!);
    const greeting = now.getFullYear() + "年" + (now.getMonth() + 1) + "月" +
      now.getDate() + "日のニュースです。";

    return greeting +
      await gptSummarizer(item.transcript, this.options.languageCode) +
      " 以上、NHKニュースをBriefCastが要約してお伝えしました。";
  }
}
