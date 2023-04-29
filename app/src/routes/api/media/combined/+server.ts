import { proxyCoreAPI } from "$lib/server/api";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (ev) => {
    const uid = ev.url.searchParams.get("uid")
    const ids = ev.url.searchParams.get("ids")
    return proxyCoreAPI(ev, `media/combined?uid=${uid}&ids=${ids}`)
}