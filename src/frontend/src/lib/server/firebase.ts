import jose from 'jose'
import {
    PUBLIC_FIREBASE_PROJECT_ID,
} from "$env/static/public";

// validate jwt sent from the client and returns uid(user id)
export async function verifyToken(jwt: string): Promise<string | null> {

    // get a valid public key
    const header = await jose.decodeProtectedHeader(jwt);
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
        const key = await jose.importX509(publicKey, "RS256");
        const result = await jose.jwtVerify(jwt, key, {
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
        console.warn("jwt verify error: ", e);
    }
    return null;
};
