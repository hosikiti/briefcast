import type { Timestamp } from "firebase/firestore";

export interface FeedData {
    link?: string;
    title?: string;
    description?: string;
    generator?: string;
    language?: string;
    published?: Date;
    entries?: any;
}

export interface FeedTemplate {
    name: string;
    description: string;
    websiteUrl: string
    feedUrl: string
    languageCode: string;
    language: string
    prompt?: string
}

export interface Podcast {
    [key: string]: string | Timestamp | undefined | null;
    name: string
    feedUrl: string
    websiteUrl: string
    lastGenerate?: Timestamp
    language: string
    prompt?: string
}

export interface TrialPodcastResult {
    id: string;
    title: string;
}
