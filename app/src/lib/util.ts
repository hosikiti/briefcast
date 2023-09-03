
export const coreApiEndpoint = 'http://briefcast_core:18088';

export const getAudioSrcFromId = (id: string): string => {
    return '/api/media?id=' + encodeURIComponent(id);
};

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

export function formatTime(time: number) {
    let h = Math.floor(time / 3600);
    let m = Math.floor((time % 3600) / 60);
    let s = Math.floor(time % 60);

    return `${h > 0 ? h + ':' : ''}${h > 0 && m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`
}
