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

(async () => {
  const sites = Deno.args.length == 0
    ? ["cnn", "nhk"]
    : Deno.args[0].split(",");

  try {
    for (const site of sites) {
      await generateForSite(site);
    }
  } catch (e) {
    console.error(e);
  }
})();
