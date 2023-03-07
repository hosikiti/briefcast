import { extract, FeedData, FeedEntry } from "../../deps.ts";
import Parser from "npm:rss-parser@3.12.0";

const maxDescriptionToImport = 1000;

// parse RSS/Atom feed and returns as RSS Feed
export const parseFeed = async (url: string): Promise<FeedData | null> => {
  const feed = await extract(url, { descriptionMaxLen: maxDescriptionToImport });
  if (feed && feed.title && feed.entries) {
    return feed;
  }
  return parseFeed2(url);
};

// parse RSS feed with a different library
const parseFeed2 = async (url: string): Promise<FeedData | null> => {
  const parser = new Parser();

  try {
    const output = await parser.parseURL(url);
    if (!output.items || output.items.length == 0) {
      return null;
    }
    // convert to FeedData
    const feed: FeedData = {
      description: output.description,
      title: output.title,
      link: output.link,
      entries: output.items.map((item) => {
        return {
          title: item.title,
          description: (item.summary || item.content)?.substring(0, maxDescriptionToImport),
        } as FeedEntry;
      }),
    };
    // use the first date as feed's published date
    // deno-lint-ignore no-explicit-any
    feed.published = (output.items[0].isoDate || (new Date()).toISOString()) as any;
    return feed;
  } catch (e) {
    console.warn(e);
    return null;
  }
};
