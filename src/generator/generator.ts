import { RSSFeed } from "./common/rss_feed.ts";
import { GenerateOption } from "./generator_factory.ts";

export interface BriefCastItem {
  feed: RSSFeed;
  transcript: string;
  isUpdated: boolean;
}

export interface BriefCastGenerator {
  getLatest(): Promise<BriefCastItem>;
  summarize(feed: BriefCastItem): Promise<string>;
  get options(): GenerateOption;
}
