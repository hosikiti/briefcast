import { coreApiEndpoint } from "$lib/util";
import type { RequestEvent } from "@sveltejs/kit";

/** 
 * Proxy request to core API server
 */
export function proxyCoreAPI(ev: RequestEvent, apiPath: string, body: (BodyInit | null | undefined) = undefined, headers: HeadersInit = {}) {
    const { fetch, request, getClientAddress } = ev;
    return fetch(`${coreApiEndpoint}/${apiPath}`, {
        method: request.method,
        headers: {
            ...{
                "Content-Type": "application/json",
                "X-Forwarded-For": request.headers.get("X-Forwarded-For") || getClientAddress(),
                "User-Agent": request.headers.get("User-Agent") || 'unknown',
                "X-User-ID": ev.locals.userId || ''
            }, ...headers
        },
        body: body,
    });
}