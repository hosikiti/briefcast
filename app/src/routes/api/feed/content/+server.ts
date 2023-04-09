import { proxyCoreAPI } from "$lib/server/api";
import { coreApiEndpoint } from "$lib/util";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { HttpStatusCode } from "axios";

export const GET: RequestHandler = async (ev) => {
    const url = ev.url.searchParams.get("url");
    const resp = await proxyCoreAPI(ev, `feed/content?url=${url}`)
    if (resp.status == HttpStatusCode.Ok) {
        return json(await resp.json())
    } else {
        return resp;
    }
} 