import { LanguageCode } from "../constant.ts";
import { doc, Firestore, getDoc, openai, serverTimestamp, setDoc } from "../deps.ts";
import { getSHA256String } from "../util/hash.ts";

const defaultEnglishPrompt = `Summarize this into a transcript using the following steps:
1. Summarize each topic into a 30 words simple English pod cast transcript. 
2. Combine them into one string until it reaches 200 bytes.
--- `;

const defaultJapanesePrompt =
  `次のトピックのリストを200文字以内のラジオ原稿に変換してください。以下の手順で実施してください。
1) トピック毎に、25文字以内の「ですます調」のラジオ原稿に変換する。その後、文末に<break time="2s"/>　を追加。
2) 全てのトピックを結合し、200文字を超えたら処理を終える。`;

export class SummarizerRepository {
  constructor(private db: Firestore) {}

  // Summarize text into podcast style transcription
  async execute(
    input: string,
    languageCode: LanguageCode,
    prompt?: string,
    useCache = true,
  ): Promise<string> {
    const configuration = new openai.Configuration({
      apiKey: Deno.env.get("OPEN_AI_API_KEY"),
    });
    const api = new openai.OpenAIApi(configuration);

    if (!prompt) {
      prompt = languageCode == LanguageCode.jaJP
        ? `${defaultJapanesePrompt}\n---\n${input}`
        : `${defaultEnglishPrompt} "${input}"`;
    }

    const cacheKey = getSHA256String(input + "$" + prompt);
    if (useCache) {
      const cachedResult = await this.getCache(cacheKey);
      if (cachedResult) {
        return cachedResult;
      }
    }

    const resp = await api.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: prompt },
      ],
    });

    let result = resp.data.choices[0].message?.content || "";
    result = result.replaceAll('<break time="2s"/>', '<break time="2s"/> ');
    if (result) {
      this.setCache(cacheKey, result);
    }
    return result;
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
}