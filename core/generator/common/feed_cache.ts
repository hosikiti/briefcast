import { ensureDirSync } from "https://deno.land/std@0.170.0/fs/ensure_dir.ts";
import { existsSync } from "../../util/common.ts";
import { FeedData } from "../../deps.ts";
import { getSHA256String } from "../../util/hash.ts";

export interface FeedCache {
  lastBuildDate: string;
  cacheCreatedDate: string;
}

const getFeedCachePath = (url: string): string => {
  const id = getSHA256String(url);
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

const getLastPublished = (feed: FeedData): string => {
  let lastPublished = feed.published?.toString();
  if (!lastPublished) {
    const firstEntryPublished = feed.entries && feed.entries[0].published;
    lastPublished = firstEntryPublished?.toString() || "";
  }
  if (lastPublished == "") {
    throw "no published info is found";
  }
  return lastPublished;
};

export const saveFeedCache = (url: string, feed: FeedData) => {
  ensureDirSync(getFeedCacheDir());
  const cachePath = getFeedCachePath(url);
  const lastPublished = getLastPublished(feed);

  const cache: FeedCache = {
    lastBuildDate: new Date(lastPublished).toISOString(),
    cacheCreatedDate: new Date().toISOString(),
  };

  Deno.writeTextFileSync(cachePath, JSON.stringify(cache));
};

export const isUpdatedFeed = (url: string, feed: FeedData): boolean => {
  const cache = getCachedFeed(url);
  if (!cache) {
    return true;
  }
  const lastPublished = getLastPublished(feed);

  return new Date(lastPublished).toISOString() != cache.lastBuildDate;
};
