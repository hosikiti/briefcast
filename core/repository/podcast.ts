import {
  collection,
  doc,
  documentId,
  Firestore,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  updateDoc,
} from "../deps.ts";
import { PodcastDefinition } from "../types.ts";

export class PodcastRepository {
  constructor(private db: Firestore) {}

  async updateLastGeneratedDate(uid: string, docId: string) {
    const ref = doc(this.db, "playlists", uid, "default", docId);
    const data = {
      lastGenerate: serverTimestamp(),
    } as PodcastDefinition;
    await updateDoc(ref, data);
  }

  async getPodcastsForAllUsers(count: number, startAfterAuthorID = ""): Promise<PodcastDefinition[]> {
    const result: PodcastDefinition[] = [];
    const ref = collection(this.db, "playlists");
    let q = query(ref, limit(count));
    if (startAfterAuthorID) {
      q = query(ref, orderBy(documentId()), limit(count), startAfter(startAfterAuthorID));
    }
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return result;
    }
    const authorIds: string[] = [];
    snapshot.forEach((doc) => {
      const authorId = doc.id;
      authorIds.push(authorId);
    });

    for (const authorId of authorIds) {
      // get default playlist
      const playlistsSnapshot = await getDocs(collection(this.db, "playlists", authorId, "default"));

      playlistsSnapshot.forEach((doc) => {
        const data = doc.data() as PodcastDefinition;
        data.authorId = authorId;
        data.docId = doc.id;
        result.push(data);
      });
    }
    return result;
  }
}
