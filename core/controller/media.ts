import { MEDIA_PATH } from "../constant.ts";
import { Context } from "../deps.ts";

export class MediaController {
  static get(ctx: Context) {
    const query = ctx.request.url.searchParams;
    const filePath = MEDIA_PATH + "/" + query.get("id") + ".mp3";
    ctx.response.body = Deno.readFileSync(filePath);
  }
}
