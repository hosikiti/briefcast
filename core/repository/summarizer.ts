import { LanguageCode } from "../constant.ts";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  endAt,
  Firestore,
  getDoc,
  getDocs,
  increment,
  openai,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "../deps.ts";
import { getSHA256String } from "../util/hash.ts";

const defaultEnglishPrompt = `Summarize this into a transcript using the following steps:
1. Summarize each topic into a 30 words simple English pod cast transcript. 
2. Combine them into one string until it reaches 200 bytes.
--- 
{feedItems}`;

const defaultJapanesePrompt =
  `次のトピックのリストを160文字以内のラジオ原稿に変換してください。以下の手順で実施してください。
  1) トピック毎に、25文字以内の「ですます調」のラジオ原稿に変換。
  2) 全てのトピックを結合し、150文字を超えたら処理を終える。
  ---
  {feedItems}
  `;

export interface SummarizeResult {
  summary: string;
  cacheKey: string;
}

export class SummarizerRepository {
  constructor(private db: Firestore) {}

  // Summarize text into podcast style transcription
  async execute(
    clientId: string,
    input: string,
    languageCode: LanguageCode,
    prompt?: string,
    useCache = true,
  ): Promise<SummarizeResult> {
    if (!prompt) {
      prompt = languageCode == LanguageCode.jaJP ? defaultJapanesePrompt : defaultEnglishPrompt;
    }
    prompt = prompt.replace(/{feedItems}/, input);

    const cacheKey = getSHA256String(prompt);
    if (useCache) {
      const cachedResult = await this.getCache(cacheKey);
      if (cachedResult) {
        return {
          summary: cachedResult,
          cacheKey,
        };
      }
    }

    const configuration = new openai.Configuration({
      apiKey: Deno.env.get("OPEN_AI_API_KEY"),
    });
    const api = new openai.OpenAIApi(configuration);
    const resp = await api.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: prompt },
      ],
    });

    if (resp.data.usage) {
      await this.saveStat(clientId, prompt, resp.data.usage.total_tokens);
    }

    const result = resp.data.choices[0].message?.content || "";
    if (result) {
      this.setCache(cacheKey, result);
    }
    return {
      summary: result,
      cacheKey,
    };
  }

  async removeOldCaches(olderThanInDays: number) {
    const now = new Date();
    const olderThan = new Date(now.valueOf() - (olderThanInDays * 24 * 60 * 60 * 1000));
    console.log(`Removing caches older than ${olderThan}`);
    const q = query(
      collection(this.db, "summarizerCaches"),
      orderBy("createdAt"),
      endAt(olderThan),
    );
    const deletedCacheIds: string[] = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(`Deleting cache ${doc.id}`);
      deletedCacheIds.push(doc.id);
      deleteDoc(doc.ref);
    });
    console.log("remove done");
  }

  private async getCache(key: string): Promise<string | null> {
    const snapshot = await getDoc(doc(this.db, "summarizerCaches", key));
    const data = snapshot.data();
    return data?.data;
  }

  private async setCache(key: string, val: string): Promise<void> {
    const ref = doc(this.db, "summarizerCaches", key);
    await setDoc(ref, { data: val, createdAt: serverTimestamp() });
  }

  private async saveStat(clientId: string, prompt: string, usedToken: number) {
    // Increment monthly total token
    const dt = new Date();
    const monthKey = dt.getFullYear() + "-" + (dt.getMonth() + 1);
    const monthlyTotalRef = doc(this.db, "monthlyTotalToken", monthKey);
    await setDoc(monthlyTotalRef, {
      requestCount: increment(1),
      tokenCount: increment(usedToken),
    }, { merge: true });

    // Save usage
    const historyRef = collection(this.db, "summarizeHistory");
    await addDoc(historyRef, {
      clientId,
      prompt,
      usedToken,
      createdAt: serverTimestamp(),
    });

    // Save stat per user
    const userStatRef = doc(this.db, "summarizeUserStat", clientId);
    await setDoc(userStatRef, {
      requestCount: increment(1),
      tokenCount: increment(usedToken),
    }, { merge: true });
  }
}
