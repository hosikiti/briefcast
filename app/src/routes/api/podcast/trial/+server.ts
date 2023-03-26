import { coreApiEndpoint } from "$lib/util";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request, fetch }) => {
    const resp = await fetch(`${coreApiEndpoint}/podcast/trial/generate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: await request.text(),
    });
    // const body = await resp.text()
    return json(await resp.json())
}