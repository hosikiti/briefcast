import type { Cookies } from "@sveltejs/kit";

export function setSecureCookie(cookies: Cookies, key: string, val: string) {
    cookies.set(key, val, {
        path: '/',
        httpOnly: true,
        sameSite: "strict"
    })
}