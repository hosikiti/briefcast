import { Context } from "../deps.ts";

export class MediaController {
  static get(ctx: Context) {
    const query = ctx.request.url.searchParams;
    const filePath = query.get("id");
    ctx.response.body = Deno.readFileSync("media/" + filePath + ".mp3");
  }
}
