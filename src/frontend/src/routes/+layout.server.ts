import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = ({ locals }) => {
    const { isLoggedIn, token } = locals
    return { isLoggedIn, token }
}