import { coreApiEndpoint } from "$lib/util";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request, fetch, getClientAddress }) => {
    await fetch(`${coreApiEndpoint}/podcast/update`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Forwarded-For": request.headers.get("X-Forwarded-For") || getClientAddress(),
            "User-Agent": request.headers.get("User-Agent") || 'unknown'
        },
        body: await request.text(),
    });
    return json({})
}