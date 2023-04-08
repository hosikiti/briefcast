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
import { BriefCastGeneratorFactory, GenerateOption } from "../generator/generator_factory.ts";
import { textToMP3 } from "../tts/text_to_speech.ts";
import { PodcastDefinition } from "../types.ts";
import { getSHA256String } from "../util/hash.ts";
import { SummarizerRepository } from "./summarizer.ts";

export class PodcastRepository {
  constructor(private db: Firestore, private summarizer: SummarizerRepository) {}

  // generate/update podcast by ID
  async generateByID(uid: string, docId: string): Promise<boolean> {
    const ref = doc(this.db, "playlists", uid, "default", docId);
    const snapshot = await getDoc(ref);
    if (!snapshot.exists()) {
      return false;
    }
    const podcast = snapshot.data() as PodcastDefinition;
    podcast.authorId = uid;
    podcast.docId = docId;
    return await this.generate(podcast);
  }

  // Generate podcast MP3
  async generate(
    pod: PodcastDefinition,
  ): Promise<boolean> {
    const opts: GenerateOption = {
      useCache: true,
      languageCode: pod.language,
      feedUrl: pod.feedUrl,
      prompt: pod.prompt,
      summarizer: this.summarizer,
    };
    const generator = BriefCastGeneratorFactory(opts);
    console.log(`get feed for ${pod.feedUrl} ... `);
    const item = await generator.getLatest();
    if (!item) {
      console.log(`failed to get the feed. SKIP.`);
      return false;
    }
    console.log(item.content);

    console.log("summarize by gpt3 ... ");
    const transcript = await generator.summarize(item);
    console.log(transcript);
    console.log(transcript.length);

    if (transcript.length == 0) {
      console.warn("transcript is empty, something went wrong.");
      return false;
    }

    // generate MP3 hash
    const mp3Hash = getSHA256String(`${transcript}:${pod.prompt}:${pod.language}`);

    if (pod.lastContentHash == mp3Hash) {
      console.warn("mp3 content is same, so skip generation.");
      return false;
    }

    console.log(`export to ${pod.authorId}/${pod.docId}.mp3 ...`);
    await textToMP3({
      text: transcript,
      languageCode: generator.options.languageCode,
      outDir: pod.authorId,
      fileNamePrefix: pod.docId,
    });

    await this.updateLastGeneratedDate(pod.authorId, pod.docId, mp3Hash);
    return true;
  }

  async updateLastGeneratedDate(uid: string, docId: string, contentHash: string) {
    const ref = doc(this.db, "playlists", uid, "default", docId);
    const data = {
      lastGenerate: serverTimestamp(),
      lastContentHash: contentHash,
    } as PodcastDefinition;
    await updateDoc(ref, data);
  }

  async getPodcastsForAllUsers(
    count: number,
    startAfterAuthorID = "",
  ): Promise<PodcastDefinition[]> {
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
      const playlistsSnapshot = await getDocs(
        collection(this.db, "playlists", authorId, "default"),
      );

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
