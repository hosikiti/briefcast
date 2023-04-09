import { proxyCoreAPI } from "$lib/server/api";
import { coreApiEndpoint } from "$lib/util";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (ev) => {
    const id = ev.url.searchParams.get("id")
    return proxyCoreAPI(ev, `media?id=${id}`, null, {
        'Content-Type': 'audio/mp3',
    })
}