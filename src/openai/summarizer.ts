import { Configuration, OpenAIApi } from "npm:openai@3.2.1";
import { LanguageCode } from "../constant.ts";

// Summarize text into podcast style transcription
export const gptSummarizer = async (
  input: string,
  languageCode: LanguageCode,
  prompt?: string,
): Promise<string> => {
  const configuration = new Configuration({
    apiKey: Deno.env.get("OPEN_AI_API_KEY"),
  });
  const openai = new OpenAIApi(configuration);

  if (!prompt) {
    prompt = languageCode == LanguageCode.jaJP
      ? `次のトピックのリストをラジオ原稿に変換してください。以下の手順で実施してください。
      1) トピック毎に、25文字以内の「ですます調」のラジオ原稿に変換する。その後、文末に　<break time="2s"/>　を追加。
      2) 全てのトピックを結合し180文字を超えたら処理を終える。\n---\n${input}`
      : `Summarize into 200 words pod cast transcription: "${input}"`;
  }

  const resp = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "user", content: prompt },
    ],
  });

  return resp.data.choices[0].message?.content || "";
};
