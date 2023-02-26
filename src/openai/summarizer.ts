import { Configuration, OpenAIApi } from "npm:openai";

// Summarize text into podcast style transcription
export const gptSummarizer = async (input: string): Promise<string> => {
  const configuration = new Configuration({
    apiKey: Deno.env.get("OPEN_AI_API_KEY"),
  });
  const openai = new OpenAIApi(configuration);

  const prompt =
    `下記ポイントを元に、140文字の日本語の「ですます調」のラジオ原稿に。\n"${input}"`;

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 0.4,
    max_tokens: 3500 - (prompt.length * 2),
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0.5,
  });

  const data = response.data;

  return data.choices[0].text ?? "";
};
