import { milliseconds } from "date-fns";

export const coreApiEndpoint = 'http://briefcast_core:18088';

export const getAudioSrcFromId = (id: string): string => {
    return '/api/media?id=' + encodeURIComponent(id);
};

export const getCombinedAudioSrc = (uid: string, ids: string[]): string => {
    const uidParam = encodeURIComponent(uid)
    const idsParam = encodeURIComponent(ids.join(','))
    return `/api/media/combined?uid=${uidParam}&ids=${idsParam}`
}

export interface LanguageCode {
    code: string;
    title: string;
    languageShortName: string;
}

export enum Gender {
    male = "male",
    female = "female"
}

export interface GenderItem {
    label: string,
    gender: Gender
}

export const genders: GenderItem[] = [
    { label: "Male", gender: Gender.male },
    { label: "Female", gender: Gender.female }
]

export const supportedLanguages: LanguageCode[] = [
    { code: 'en-US', title: 'English (US)', languageShortName: 'English' },
    { code: 'ja-JP', title: '日本語', languageShortName: 'Japanese' }
];

export const languageShortNameMap = supportedLanguages.reduce((prev, current) => {
    prev[current.code] = current.languageShortName
    return prev;
}, {} as { [key: string]: string })

export const isEnglish = (code: string) => {
    return code.startsWith("en-");
}

export const sleep = async (milliseconds: number) => {
    return new Promise<void>(resolve => setTimeout(resolve, milliseconds))
}

export const getBrowserLanguage = (): string => {
    const language = navigator.language || navigator.languages[0];
    return language;
}

export const isJapaneseBrowser = (): boolean => {
    const language = getBrowserLanguage();
    return language.startsWith("ja");
}