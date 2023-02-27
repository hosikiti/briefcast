import { RSSFeed } from "./sites/common/rss_feed.ts";

export interface BriefCastItem {
  feed: RSSFeed;
  transcript: string;
  isUpdated: boolean;
}

export interface BriefCastGenerator {
  getLatest(): Promise<BriefCastItem>;
  summarize(feed: BriefCastItem): Promise<string>;
  getLanguageCode(): string;
}
