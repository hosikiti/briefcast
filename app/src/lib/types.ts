import type { Timestamp } from "firebase/firestore";

export interface FeedTemplate {
    name: string;
    description: string;
    feedUrl: string
    languageCode: string;
    language: string
    prompt?: string
}

export interface Podcast {
    name: string
    feedUrl: string
    websiteUrl: string
    lastGenerate?: Timestamp
}
