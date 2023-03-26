import { setSecureCookie } from "$lib/server/cookie";
import { encryptString } from "$lib/server/crypt";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request, cookies }) => {
    const body = await request.json();
    const token = body.token || '';
    if (token) {
        const refreshToken = body.refreshToken || '';
        const encryptedRefreshToken = encryptString(refreshToken);
        setSecureCookie(cookies, 'token', token)
        setSecureCookie(cookies, 'encryptedRefreshToken', encryptedRefreshToken)
    } else {
        cookies.delete('token', { path: '/' })
        cookies.delete('encryptedRefreshToken', { path: '/' })
    }
    return json({})
}