import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request, cookies }) => {
    const body = await request.json();
    const token = body.token || '';
    if (token) {
        cookies.set('token', token, {
            path: '/',
            httpOnly: true
        })
    } else {
        cookies.delete('token', { path: '/' })
    }
    return json({})
}