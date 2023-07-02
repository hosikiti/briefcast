import type { FeedData } from "$lib/types";
import axios from "axios";

export const getFeed = async (url: string): Promise<FeedData | null> => {
    try {
        const resp = await axios.get(`/api/feed/content?url=${encodeURIComponent(url)}`);
        return resp.data as FeedData;
    } catch (e) {
        return null;
    }
}
