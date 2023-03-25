import { verifyToken } from "$lib/server/firebase";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get('token') || '';
    event.locals.isLoggedIn = false
    if (token) {
        const fbUserId = await verifyToken(token)
        event.locals.isLoggedIn = fbUserId !== null
        event.locals.token = event.locals.isLoggedIn ? token : ''
        event.locals.userId = event.locals.isLoggedIn ? fbUserId! : ''
    }
    const response = await resolve(event)
    return response;
}