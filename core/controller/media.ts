import { MEDIA_PATH } from "../constant.ts";
import { Context } from "../deps.ts";
import { logger } from "../util/logger.ts";
import { setHttpNotFound, setHttpSuccess } from "./base.ts";
import { Buffer } from "../deps.ts";

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

  // Combine several media into a single mp3 for 'Play All' feature
  // TODO: support http range request to save memory.
  static getCombined(ctx: Context) {
    try {
      const query = ctx.request.url.searchParams;
      const uid = query.get("uid");
      const mediaIds = (query.get("ids") || "").split(",");
      if (mediaIds.length == 0) {
        setHttpNotFound(ctx);
        return;
      }

      const buf = new Buffer();
      for (const mediaId of mediaIds) {
        try {
          const filePath = MEDIA_PATH + "/" + `${uid}/${mediaId}` + ".mp3";
          buf.writeSync(Deno.readFileSync(filePath));
        } catch (e) {
          // Throw only if the error is NOT "file not found"
          if (!(e instanceof Deno.errors.NotFound)) {
            throw e;
          }
        }
      }

      ctx.response.headers.set("Content-Type", "audio/mp3");
      ctx.response.body = buf.bytes();
    } catch (e) {
      logger.error(e);
      setHttpSuccess(ctx);
    }
  }
}
