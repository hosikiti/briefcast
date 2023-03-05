import { RSSFeed } from "./rss_feed.ts";
import { parse } from "https://deno.land/x/xml@2.1.0/mod.ts";

// parse RSS/Atom feed and returns as RSS Feed
export const parseFeed = async (url: string): Promise<RSSFeed> => {
  const resp = await fetch(url);
  const body = await resp.text();
  const data = parse(body);
  const rss = (data.rss) as unknown;
  const feed = rss as RSSFeed;
  return feed;
};
