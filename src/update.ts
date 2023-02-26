import { BriefCastGeneratorFactory } from "./generator_factory.ts";
import { textToMP3 } from "./tts/text_to_speech.ts";

export const MAX_TRANSCRIPT_LENGTH = 2000;

const generateForSite = async (site: string) => {
  const generator = BriefCastGeneratorFactory(site);
  console.log(`get feed for ${site} ... `);
  const transcript = await generator.getTranscript();
  console.log(transcript);
  console.log("summarize by gpt3 ... ");
  const briefTranscript = await generator.summarize(transcript);
  console.log(briefTranscript);
  console.log(briefTranscript.length);
  await textToMP3({
    text: briefTranscript,
    languageCode: generator.getLanguageCode(),
    fileNamePrefix: site,
  });
};

(() => {
  const sites = ["nhk", "cnn"];

  try {
    sites.forEach(async (site) => {
      await generateForSite(site);
    });
  } catch (e) {
    console.error(e);
  }
})();
