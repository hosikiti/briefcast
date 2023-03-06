import { extract, FeedData } from "../../deps.ts";

// parse RSS/Atom feed and returns as RSS Feed
export const parseFeed = async (url: string): Promise<FeedData> => {
  return await extract(url, { descriptionMaxLen: 1000 });
};
