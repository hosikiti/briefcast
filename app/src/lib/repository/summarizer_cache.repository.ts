import { db } from "$lib/firebase";
import type { SummarizerCache } from "$lib/types";
import { doc, getDoc } from "firebase/firestore";

export const getSummarizerCache = async (hash: string): Promise<string> => {
    const docRef = doc(db, `summarizerCaches/${hash}`);
    const record = await getDoc(docRef);
    const data = record.data() as unknown;
    const cache = data as SummarizerCache;
    return cache.data || '';
}