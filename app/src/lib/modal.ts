import { type ModalSettings, modalStore } from "@skeletonlabs/skeleton";

export function showConfirm(title: string, buttonTextConfirm = 'OK') {
    return new Promise<boolean>((resolve) => {
        const confirm: ModalSettings = {
            type: 'confirm',
            title: title,
            buttonTextConfirm: buttonTextConfirm,
            response: async (yes: boolean) => {
                resolve(yes);
            }
        };
        modalStore.trigger(confirm);
    })
}
