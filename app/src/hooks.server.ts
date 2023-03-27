import { getNewToken, verifyToken, VerifyTokenErrExpired } from "$lib/server/firebase";
import type { Handle } from "@sveltejs/kit";
import { decryptString } from "$lib/server/crypt";
import { setSecureCookie } from "$lib/server/cookie";

export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get('token') || '';
    const encryptedRefreshToken = event.cookies.get('encryptedRefreshToken') || ''
    event.locals.isLoggedIn = false
    if (token) {
        let fbUserId: string | null = null;

        try {
            fbUserId = await verifyToken(token)
        } catch (e) {
            // if token expires, get new token with a refresh token
            if (e instanceof VerifyTokenErrExpired && encryptedRefreshToken) {
                const refreshToken = decryptString(encryptedRefreshToken)
                const newToken = await getNewToken(refreshToken)
                if (newToken) {
                    fbUserId = await verifyToken(newToken);
                    setSecureCookie(event.cookies, 'token', newToken);
                }
            }
        }
        event.locals.isLoggedIn = fbUserId !== null
        event.locals.token = event.locals.isLoggedIn ? token : ''
        event.locals.userId = event.locals.isLoggedIn ? fbUserId! : ''
    }
    const response = await resolve(event)
    return response;
}