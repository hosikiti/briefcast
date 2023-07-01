import { type ModalSettings, modalStore, type ModalComponent } from "@skeletonlabs/skeleton";

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

export function showCustomModel<ResponseType>(ref: any, props?: Record<string, unknown>, responseHandler?: (r: ResponseType) => void) {
    const d: ModalSettings = {
        type: 'component',
        // Pass the component directly:
        component: {
            // Pass a reference to your custom component
            ref: ref,
            // Add the component properties as key/value pairs
            props: props,
        } as ModalComponent,
        response: responseHandler
    };

    modalStore.trigger(d);
}