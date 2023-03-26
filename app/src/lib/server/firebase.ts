import { decodeProtectedHeader, importX509, jwtVerify, errors as joseErrors } from 'jose'
import {
    PUBLIC_FIREBASE_API_KEY,
    PUBLIC_FIREBASE_PROJECT_ID,
} from "$env/static/public";

export class VerifyTokenErrExpired extends Error {
    constructor(e: Error) {
        super();
        this.message = e.message
    }
}

// validate jwt sent from the client and returns uid(user id)
export async function verifyToken(jwt: string): Promise<string | null> {

    // get a valid public key
    const header = await decodeProtectedHeader(jwt);
    if (header.kid == null) {
        return null;
    }

    const resp = await fetch(
        "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com",
    );
    const publicKeys = await resp.json();
    const publicKey = publicKeys[header.kid] as string | null;
    if (publicKey == null) {
        return null;
    }

    // verify jwt
    try {
        const key = await importX509(publicKey, "RS256");
        const result = await jwtVerify(jwt, key, {
            algorithms: ["RS256"],
            audience: PUBLIC_FIREBASE_PROJECT_ID,
            issuer: `https://securetoken.google.com/${PUBLIC_FIREBASE_PROJECT_ID}`,
        });
        if (result.payload.sub == null || result.payload.sub.length == 0) {
            return null;
        }
        // payload.sub is a uid
        return result.payload.sub;
    } catch (e) {
        if (e instanceof joseErrors.JWTExpired) {
            throw new VerifyTokenErrExpired(e)
        }
        console.warn("verify token error", e)
        return null
    }
}

// Get new Firebase token from refresh token
export async function getNewToken(refreshToken: string): Promise<string | null> {
    const data = {
        grant_type: "refresh_token",
        refresh_token: refreshToken
    }
    try {
        const resp = await fetch(`https://securetoken.googleapis.com/v1/token?key=${PUBLIC_FIREBASE_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        })
        const result = await resp.json()
        return result.id_token || null
    } catch (e) {
        console.warn("get new token failed: ", e);
        return null;
    }
}