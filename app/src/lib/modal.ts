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

export function showAlert(title: string, buttonTextCancel = 'OK', body?: string, modalClass = '') {
    return new Promise<boolean>((resolve) => {
        const confirm: ModalSettings = {
            type: 'alert',
            title: title,
            body: body,
            modalClasses: modalClass,
            buttonTextCancel: buttonTextCancel,
            response: async (yes: boolean) => {
                resolve(yes);
            }
        };
        modalStore.trigger(confirm);
    })
}
