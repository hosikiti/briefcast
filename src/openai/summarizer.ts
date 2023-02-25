import { Configuration, OpenAIApi } from "npm:openai";

// Summarize text into podcast style transcription
export const gptSummarizer = async (input: string): Promise<string> => {
  const configuration = new Configuration({
    apiKey: Deno.env.get("OPEN_AI_API_KEY"),
  });
  const openai = new OpenAIApi(configuration);

  const prompt =
    "Summarize this into 150 words news transcription in Japanese: " + input;

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 0,
    max_tokens: 3500 - (prompt.length * 2),
    top_p: 1,
    frequency_penalty: 0.2,
    presence_penalty: 0,
  });

  const data = response.data;

  return data.choices[0].text ?? "";
};
