import type { Load } from '@sveltejs/kit';

export const load: Load = ({ url, params }) => {
    const queries = url.searchParams;
    const id = queries.get('id') || ''
    const title = queries.get('title') || ''
    return {
        id, title
    };
};