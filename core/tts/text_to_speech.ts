import { ensureDir } from "https://deno.land/std@0.170.0/fs/ensure_dir.ts";
import { GoogleAuth, texttospeech } from "https://googleapis.deno.dev/v1/texttospeech:v1.ts";
import { LanguageCode, MEDIA_PATH } from "../constant.ts";
import { SSMLSplit } from "https://esm.sh/ssml-split@0.5.0";
import { Buffer } from "../deps.ts";
import { splitJapanese } from "./text_splitter.ts";

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
  // Add pause at the end of each sentence
  if (option.languageCode == "ja-JP") {
    input = input.replace(/。/g, '。<break time="1500ms"/> ');
  }

  // To avoid following error, split the input text into smaller chunks.
  // Uncaught GoogleApiError: 400: This request contains sentences that are too long.
  const ssmlSplit = new SSMLSplit({
    synthesizer: "google",
    softLimit: 400,
    hardLimit: 5000,
    breakParagraphsAboveHardLimit: false,
    extraSplitChars: ",;.",
  });

  const client = new texttospeech(authClient);
  let ssmlInput = `${input}`;
  let ssmlParts: string[] = [];
  if (option.languageCode == "en-US") {
    ssmlInput = `<speak>${ssmlInput}</speak>`;
    ssmlParts = ssmlSplit.split(ssmlInput).filter((part) => part != "<speak></speak>");
  } else {
    // As Google TTS API cannot process long Japanese sentence more than around 100 words,
    // split text into small chunks using original algorithm.
    ssmlParts = splitJapanese(ssmlInput, 100).map((s) => `<speak>${s}</speak>`);
  }

  const textSynthesizePromises = ssmlParts.map((ssml) => {
    return client.textSynthesize({
      input: { ssml: ssml },
      voice: {
        languageCode: option.languageCode,
        name: defaultVoiceNameMap[option.languageCode],
      },
      audioConfig: { audioEncoding: "MP3", pitch: -2 },
    });
  });
  // combine audio buffers to generate single MP3
  const allAudioBuffers = await Promise.all(textSynthesizePromises);
  const buf = new Buffer();
  for (const audio of allAudioBuffers) {
    buf.writeSync(audio.audioContent!);
  }

  await Deno.writeFile(
    `${mediaPath}/${option.fileNamePrefix}.mp3`,
    buf.bytes(),
  );
};
