import { LanguageCode } from "../constant.ts";
import { addDoc, collection, Firestore } from "../deps.ts";

interface PodcastDefinition {
  feedUrl: string;
  language: LanguageCode;
  uid: string;
}

export class PodcastRepository {
  constructor(private db: Firestore) {
  }

  async addPodcast(podcast: PodcastDefinition) {
    const ref = collection(this.db, `playlists/${podcast.uid}/defualt`);
    await addDoc(ref, podcast);
  }
}
