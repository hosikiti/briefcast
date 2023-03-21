import { onAuthStateChanged, type UserInfo } from "firebase/auth";
import { writable } from "svelte/store";
import { auth } from "./lib/firebase";

export interface AuthData {
    loggedIn: boolean
    user?: UserInfo
    token?: string
}

export const authStore = writable({
    loggedIn: false,
} as AuthData)

// Update authStore on Firebase auth status
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const idToken = await user.getIdTokenResult()

        authStore.set({
            loggedIn: true,
            user: user,
            token: idToken.token
        })
    } else {
        authStore.set({
            loggedIn: false
        })
    }
})
