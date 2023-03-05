export interface RSSFeed {
  channel: RSSFeedChannel;
}

interface RSSFeedChannel {
  title: string;
  item: RSSFeedItem[];
  language: string;
  lastBuildDate: string;
}

interface RSSFeedItem {
  title: string;
  description?: string;
}
