import { ensureDir } from "https://deno.land/std@0.170.0/fs/ensure_dir.ts";
import { GoogleAuth, texttospeech } from "https://googleapis.deno.dev/v1/texttospeech:v1.ts";
import { LanguageCode, MEDIA_PATH } from "../constant.ts";

const credentials = Deno.readTextFileSync(
  Deno.env.get("GOOGLE_APPLICATION_CREDENTIALS") || "",
);
const authClient = (new GoogleAuth()).fromJSON(JSON.parse(credentials));

export interface TextToMP3Option {
  text: string;
  languageCode: string;
  fileNamePrefix: string;
  outDir?: string;
}

const defaultVoiceNameMap: { [key: string]: string } = {
  [LanguageCode.jaJP]: "ja-JP-Neural2-C",
  [LanguageCode.enUS]: "en-US-Neural2-G",
};

export const textToMP3 = async (option: TextToMP3Option) => {
  let mediaPath = MEDIA_PATH;
  if (option.outDir) {
    mediaPath = mediaPath + "/" + option.outDir;
  }
  await ensureDir(mediaPath);

  let input = option.text;
  // To avoid following error in Japanese, shorten the input text.
  // Uncaught GoogleApiError: 400: This request contains sentences that are too long.
  if (option.languageCode == "ja-JP") {
    input = input.substring(0, 400);
    input = input.replace(/。/g, '。<break time="2s"/> ');
  }

  const client = new texttospeech(authClient);
  const resp = await client.textSynthesize({
    input: { ssml: `<speak>${input}</speak>` },
    voice: {
      languageCode: option.languageCode,
      name: defaultVoiceNameMap[option.languageCode],
    },
    audioConfig: { audioEncoding: "MP3", pitch: -2 },
  });
  await Deno.writeFile(
    `${mediaPath}/${option.fileNamePrefix}.mp3`,
    resp.audioContent!,
  );
  return;
};
