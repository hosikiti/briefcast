import { ensureDirSync } from "https://deno.land/std@0.170.0/fs/ensure_dir.ts";
import { existsSync } from "../../util/common.ts";
import { RSSFeed } from "./rss_feed.ts";
import { encode, Hash } from "https://deno.land/x/checksum@1.2.0/mod.ts";

export interface FeedCache {
  lastBuildDate: string;
  cacheCreatedDate: string;
}

const getFeedCachePath = (url: string): string => {
  const id = new Hash("sha1").digest(encode(url)).hex();
  const cachePath = getFeedCacheDir() + "/" + id + ".json";
  return cachePath;
};

const getFeedCacheDir = (): string => {
  return "./cache";
};

const getCachedFeed = (url: string): FeedCache | null => {
  ensureDirSync(getFeedCacheDir());
  const cachePath = getFeedCachePath(url);
  if (existsSync(cachePath) == false) {
    return null;
  }

  const f = Deno.readTextFileSync(cachePath);
  const cache = JSON.parse(f) as FeedCache;
  return cache;
};

export const saveFeedCache = (url: string, feed: RSSFeed) => {
  ensureDirSync(getFeedCacheDir());
  const cachePath = getFeedCachePath(url);
  const cache: FeedCache = {
    lastBuildDate: feed.channel.lastBuildDate,
    cacheCreatedDate: new Date().toISOString(),
  };

  Deno.writeTextFileSync(cachePath, JSON.stringify(cache));
};

export const isUpdatedFeed = (url: string, feed: RSSFeed): boolean => {
  const cache = getCachedFeed(url);
  if (!cache) {
    return true;
  }
  return feed.channel.lastBuildDate != cache.lastBuildDate;
};
