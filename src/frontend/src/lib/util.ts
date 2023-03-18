import { dev } from '$app/environment';
export const apiHost = dev ? 'http://localhost:8088' : '';

export const getAudioSrcFromId = (id: string): string => {
    return apiHost + '/media?id=' + id;
};
