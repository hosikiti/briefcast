import { MEDIA_PATH } from "../constant.ts";
import { Context } from "../deps.ts";
import { logger } from "../util/logger.ts";
import { setHttpNotFound } from "./base.ts";

export class MediaController {
  static get(ctx: Context) {
    try {
      const query = ctx.request.url.searchParams;
      const filePath = MEDIA_PATH + "/" + query.get("id") + ".mp3";
      ctx.response.headers.set("Content-Type", "audio/mp3");
      ctx.response.body = Deno.readFileSync(filePath);
    } catch (e) {
      logger.error(e);
      setHttpNotFound(ctx);
    }
  }
}
