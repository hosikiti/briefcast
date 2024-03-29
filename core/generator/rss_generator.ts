import { parseFeed } from "./common/feed_parser.ts";
import { BriefCastGenerator, BriefCastItem, TranscriptResult } from "./generator.ts";
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

      // Use only first two topics for preview purpose
      if (this.options.isPreview == true && result.length >= 2) {
        break;
      }
    }

    const content = result.join("\n");

    return {
      feed,
      content,
    };
  }

  async makeTranscript(item: BriefCastItem): Promise<TranscriptResult> {
    let intro = "";
    let closing = "";
    const { languageCode, prompt, summarizer, isPreview, useCache, title, clientId } = this.options;

    if (!isPreview) {
      // Create intro part
      intro = `This is from ${title || item.feed.title}. `;
      if (languageCode == "ja-JP") {
        intro = (title || item.feed.title) + "からお伝えします。";
      }

      // Create closing part
      closing = " That's all for today by BriefCast.";
      if (languageCode == "ja-JP") {
        closing = " 以上、BriefCastがお伝えしました。";
      }
    }

    // Summarize the transcript
    const sumResult = await summarizer.execute(
      clientId,
      item.content,
      languageCode,
      prompt,
      useCache,
    );
    const transcript = intro + sumResult.summary + closing;

    return {
      transcript,
      cacheKey: sumResult.cacheKey,
    };
  }
}
