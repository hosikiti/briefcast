import { coreApiEndpoint } from "$lib/util";
import { json } from "@sveltejs/kit";
import type { RequestEvent, RequestHandler } from "./$types";
import { proxyCoreAPI } from "$lib/server/api";

export const POST: RequestHandler = async (ev) => {
    await proxyCoreAPI(ev, "podcast/update", await ev.request.text())
    return json({})
}

