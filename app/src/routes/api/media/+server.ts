import { coreApiEndpoint } from "$lib/util";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ request, url, fetch, getClientAddress }) => {
    const id = url.searchParams.get("id")
    return fetch(`${coreApiEndpoint}/media?id=${id}`, {
        headers: {
            "X-Forwarded-For": request.headers.get("X-Forwarded-For") || getClientAddress(),
            "User-Agent": request.headers.get("User-Agent") || 'unknown'
        }
    })
}