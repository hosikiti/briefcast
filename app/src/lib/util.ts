import { dev } from '$app/environment';
export const mediaHost = dev ? '' : '';

export const getAudioSrcFromId = (id: string): string => {
    return mediaHost + '/api/media?id=' + id;
};

export interface LanguageCode {
    code: string;
    title: string;
}

export const supportedLanguages: LanguageCode[] = [
    { code: 'en-US', title: 'English (US)' },
    { code: 'ja-JP', title: '日本語' }
];
