import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load = (async ({ parent }) => {
    const { isLoggedIn } = await parent();

    if (isLoggedIn) {
        throw redirect(307, "/")
    }
}) satisfies PageLoad;