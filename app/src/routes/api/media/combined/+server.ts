import { coreApiEndpoint } from "$lib/util";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ request, url, fetch, getClientAddress }) => {
    const uid = url.searchParams.get("uid")
    const ids = url.searchParams.get("ids")
    return fetch(`${coreApiEndpoint}/media/combined?uid=${uid}&ids=${ids}`, {
        headers: {
            "X-Forwarded-For": request.headers.get("X-Forwarded-For") || getClientAddress(),
            "User-Agent": request.headers.get("User-Agent") || 'unknown'
        }
    })
}