import type { TrialPodcastResult } from "$lib/types";
import axios, { HttpStatusCode } from "axios";

export const updatePodcast = async (uid: string, docId: string) => {
    try {
        const resp = await axios.post('/api/podcast/update', {
            uid,
            docId
        });
        if (resp.status != HttpStatusCode.Ok) {
            console.error('update podcast failed', resp.status);
            return;
        }
    } catch (e) {
        console.error(e);
    }
}

export const generateTrialPodcast = async (feedUrl: string, langCode: string): Promise<TrialPodcastResult | null> => {
    try {
        const resp = await axios.post('/api/podcast/trial', {
            feedUrl: feedUrl,
            languageCode: langCode
        });
        if (resp.status != HttpStatusCode.Ok) {
            return null;
        }
        const result = resp.data.result as TrialPodcastResult;
        return result
    } catch (e) {
        console.error(e)
        return null
    }
}