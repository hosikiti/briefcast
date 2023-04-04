import { milliseconds } from "date-fns";

export const coreApiEndpoint = 'http://briefcast_core:18088';

export const getAudioSrcFromId = (id: string): string => {
    return '/api/media?id=' + encodeURIComponent(id);
};

export interface LanguageCode {
    code: string;
    title: string;
}

export const supportedLanguages: LanguageCode[] = [
    { code: 'en-US', title: 'English (US)' },
    { code: 'ja-JP', title: '日本語' }
];

export const isEnglish = (code: string) => {
    return code.startsWith("en-");
}

export const sleep = async (milliseconds: number) => {
    return new Promise<void>(resolve => setTimeout(resolve, milliseconds))
}