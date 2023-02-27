import { Configuration, OpenAIApi } from "npm:openai";

// Summarize text into podcast style transcription
export const gptSummarizer = async (
  input: string,
  languageCode: string,
): Promise<string> => {
  const configuration = new Configuration({
    apiKey: Deno.env.get("OPEN_AI_API_KEY"),
  });
  const openai = new OpenAIApi(configuration);

  const prompt = languageCode == "ja-JP"
    ? `下記トピックを元に、140文字で「ですます調」の日本語のラジオ原稿にし、トピック間の接続詞は取る。\n"${input}"`
    : `Summarize into 200 words pod cast transcription: "${input}"`;

  const maxTokens = languageCode == "ja-JP" ? 3500 - (prompt.length * 2) : 3500 - prompt.length;

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 0.4,
    max_tokens: maxTokens,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0.5,
  });

  const data = response.data;

  return data.choices[0].text ?? "";
};
