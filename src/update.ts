import { BriefCastGeneratorFactory } from "./generator_factory.ts";
import { textToMP3 } from "./tts/text_to_speech.ts";

(async () => {
  const generator = BriefCastGeneratorFactory("nhk");
  console.log("get feed ... ");
  const transcript = await generator.getTranscript();
  console.log(transcript);
  console.log("summarize by gpt3 ... ");
  const briefTranscript = await generator.summarize(transcript);
  console.log(briefTranscript);
  await textToMP3({
    text: briefTranscript,
    languageCode: "ja-JP",
    fileNamePrefix: "nhk",
  });
})();
