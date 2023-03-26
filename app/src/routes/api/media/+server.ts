import { coreApiEndpoint } from "$lib/util";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ request, url, fetch }) => {
    const id = url.searchParams.get("id")

    return fetch(`${coreApiEndpoint}/media?id=${id}`)
}