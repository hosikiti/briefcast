import { MEDIA_PATH } from "../constant.ts";
import { Context } from "../deps.ts";
import { logger } from "../util/logger.ts";
import { setHttpNotFound, setHttpSuccess } from "./base.ts";
import { Buffer } from "../deps.ts";

export class MediaController {
  static get(ctx: Context) {
    try {
      // get requested range
      const range = ctx.request.headers.get("range") || "bytes=0-";
      let [rangeStart, rangeEnd] = range.replace(/bytes=/, "").split("-").map((el) =>
        parseInt(el, 10)
      );

      // set default range if not specified
      if (!rangeEnd) {
        rangeEnd = rangeStart + (1024 * 1024); // 1MB
      }

      const query = ctx.request.url.searchParams;
      const filePath = MEDIA_PATH + "/" + query.get("id") + ".mp3";

      const content = Deno.readFileSync(filePath);
      const result = content.slice(rangeStart, rangeEnd + 1);

      ctx.response.headers.set("Content-Type", "audio/mp3");
      ctx.response.headers.set("Cache-Control", "no-store");
      // support HTTP range request
      ctx.response.headers.set("Accept-Ranges", "bytes");
      ctx.response.headers.set("Content-Length", `${content.byteLength}`);
      ctx.response.headers.set(
        "Content-Range",
        `bytes ${rangeStart}-${rangeEnd}/${content.byteLength}`,
      );

      ctx.response.body = result;
    } catch (e) {
      logger.error(e);
      setHttpNotFound(ctx);
    }
  }
}
