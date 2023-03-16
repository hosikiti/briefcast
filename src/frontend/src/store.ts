import { onAuthStateChanged, type UserInfo } from "firebase/auth";
import { writable } from "svelte/store";
import { auth } from "./helpers/firebase";

export interface AuthData {
    loggedIn: boolean
    user?: UserInfo
}

export const authStore = writable({
    loggedIn: false,
} as AuthData)

// Update authStore on Firebase auth status
onAuthStateChanged(auth, (user) => {
    if (user) {
        authStore.set({
            loggedIn: true,
            user: user
        })
    } else {
        authStore.set({
            loggedIn: false
        })
    }
})
