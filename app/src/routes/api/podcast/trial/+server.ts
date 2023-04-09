import { coreApiEndpoint } from "$lib/util";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { proxyCoreAPI } from "$lib/server/api";

export const POST: RequestHandler = async (ev) => {
    const resp = await proxyCoreAPI(ev, `podcast/trial/generate`, await ev.request.text())
    return json(await resp.json())
}