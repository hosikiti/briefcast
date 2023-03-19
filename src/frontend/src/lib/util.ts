import { dev } from '$app/environment';
export const apiHost = dev ? 'http://localhost:8088' : '';

export const getAudioSrcFromId = (id: string): string => {
    return apiHost + '/media?id=' + id;
};

export interface LanguageCode {
    code: string;
    title: string;
}

export const supportedLanguages: LanguageCode[] = [
    { code: 'en-US', title: 'English (US)' },
    { code: 'ja-JP', title: '日本語' }
];
