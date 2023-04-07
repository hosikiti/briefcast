import { toastStore, type ToastSettings } from '@skeletonlabs/skeleton';

export function showToast(message: string) {
    const t: ToastSettings = {
        message,
        background: 'variant-filled-primary'
    };
    toastStore.trigger(t);
}