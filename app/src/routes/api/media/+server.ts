import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ request, url, fetch }) => {
    const id = url.searchParams.get("id")

    return fetch("http://briefcast_core:18088/media?id=" + id)
}