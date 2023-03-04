import { BriefCastGenerator, BriefCastItem } from "../generator.ts";
import { GenerateOption } from "../generator_factory.ts";
import { gptSummarizer } from "../openai/summarizer.ts";
import { MAX_TRANSCRIPT_LENGTH } from "../update.ts";
import { isUpdatedFeed, saveFeedCache } from "./common/feed_cache.ts";
import { parseFeed } from "./common/feed_parser.ts";

const feedUrl = "http://rss.cnn.com/rss/edition.rss";

export class CNNGenerator implements BriefCastGenerator {
  private options: GenerateOption;

  constructor(opts?: GenerateOption) {
    this.options = opts || {
      useCache: true,
    };
  }

  getLanguageCode(): string {
    return "en-US";
  }
  async getLatest(): Promise<BriefCastItem> {
    const feed = await parseFeed(feedUrl);

    const buildDate = new Date(feed.channel.lastBuildDate);
    console.log(buildDate);
    console.log(feed.channel.lastBuildDate);
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
    const pubDate = new Date(item.feed.channel.lastBuildDate);
    const month = this.getMonthName(pubDate.getMonth());
    const day = pubDate.getDate();
    const year = pubDate.getFullYear();
    const intro = `Welcome to CNN news summary. Today's date is ${month}/${day}/${year}.`;

    // Create closing part
    const closing = " That's all for today's CNN news summary by BriefCast.";

    // Summarize the given text
    const prompt =
      "Make it into 150 words simple English pod cast transcription for English learners. Don't add unappropriate linking words between topics: " +
      item.transcript;
    const body = await gptSummarizer(item.transcript, this.getLanguageCode(), prompt);

    return intro + body + closing;
  }

  // monthIndex starts from 0
  getMonthName(monthIndex: number): string {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return months[monthIndex];
  }
}
