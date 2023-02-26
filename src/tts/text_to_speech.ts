import {
  GoogleAuth,
  texttospeech,
} from "https://googleapis.deno.dev/v1/texttospeech:v1.ts";

const credentials = Deno.readTextFileSync(
  Deno.env.get("GOOGLE_APPLICATION_CREDENTIALS") || "",
);
const authClient = (new GoogleAuth()).fromJSON(JSON.parse(credentials));

export interface TextToMP3Option {
  text: string;
  languageCode: string;
  fileNamePrefix: string;
}

export const textToMP3 = async (option: TextToMP3Option) => {
  const client = new texttospeech(authClient);
  const resp = await client.textSynthesize({
    input: { text: option.text },
    voice: { languageCode: option.languageCode, name: "ja-JP-Neural2-C" },
    audioConfig: { audioEncoding: "MP3", pitch: -2 },
  });
  Deno.writeFile(`./media/${option.fileNamePrefix}.mp3`, resp.audioContent!);
  return;
};
