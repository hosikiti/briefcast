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
      ? `下記トピックを、200文字に要約し、「ですます調」のラジオ原稿にして。「さらに」「一方」「また」などの接続詞は使わないで\n"${input}"`
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
