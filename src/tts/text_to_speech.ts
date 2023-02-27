import { ensureDir } from "https://deno.land/std@0.170.0/fs/ensure_dir.ts";
import { GoogleAuth, texttospeech } from "https://googleapis.deno.dev/v1/texttospeech:v1.ts";

const credentials = Deno.readTextFileSync(
  Deno.env.get("GOOGLE_APPLICATION_CREDENTIALS") || "",
);
const authClient = (new GoogleAuth()).fromJSON(JSON.parse(credentials));

export interface TextToMP3Option {
  text: string;
  languageCode: string;
  fileNamePrefix: string;
}

const defaultVoiceNameMap: { [key: string]: string } = {
  "ja-JP": "ja-JP-Neural2-C",
  "en-US": "en-US-Neural2-G",
};

export const textToMP3 = async (option: TextToMP3Option) => {
  const mediaPath = "./media";
  await ensureDir(mediaPath);

  const client = new texttospeech(authClient);
  const resp = await client.textSynthesize({
    input: { text: option.text },
    voice: {
      languageCode: option.languageCode,
      name: defaultVoiceNameMap[option.languageCode],
    },
    audioConfig: { audioEncoding: "MP3", pitch: -2 },
  });
  Deno.writeFile(
    `${mediaPath}/${option.fileNamePrefix}.mp3`,
    resp.audioContent!,
  );
  return;
};
