import { Context } from "../deps.ts";
import { parseFeed } from "../generator/common/feed_parser.ts";
import { logger } from "../util/logger.ts";
import { setHttpBadRequest, setHttpNotFound } from "./base.ts";

export class FeedController {
  static async getContent(ctx: Context) {
    try {
      const query = ctx.request.url.searchParams;
      const feedUrl = query.get("url");
      if (!feedUrl) {
        setHttpBadRequest(ctx);
        return;
      }
      const feed = await parseFeed(feedUrl);
      if (!feed) {
        setHttpNotFound(ctx);
        return;
      }
      ctx.response.body = feed;
    } catch (e) {
      logger.error(e);
      setHttpNotFound(ctx);
    }
  }
}
