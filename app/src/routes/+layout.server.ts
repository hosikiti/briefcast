import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = ({ locals }) => {
    const { isLoggedIn, token, userId } = locals
    return { isLoggedIn, token, userId }
}