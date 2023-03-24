// since there's no dynamic data here, we can prerender

import type { PageLoad } from "./$types";

// it so that it gets served as a static asset in production
export const prerender = false;

export const load: PageLoad = async function load({ parent }) {
    const parentData = await parent()
    const { isLoggedIn, token } = parentData
    return {
        isLoggedIn,
        token
    }
}