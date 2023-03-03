import { Configuration, OpenAIApi } from "npm:openai@3.2.1";

// Summarize text into podcast style transcription
export const gptSummarizer = async (
  input: string,
  languageCode: string,
  prompt?: string,
): Promise<string> => {
  const configuration = new Configuration({
    apiKey: Deno.env.get("OPEN_AI_API_KEY"),
  });
  const openai = new OpenAIApi(configuration);

  if (!prompt) {
    prompt = languageCode == "ja-JP"
      ? `下記トピックを元に、150文字の日本語のラジオ原稿にして。トピック間の接続詞は使わず、事実を淡々と「ですます調」で。\n"${input}"`
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
