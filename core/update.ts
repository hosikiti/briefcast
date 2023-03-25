import { LanguageCode } from "./constant.ts";
import { BriefCastGeneratorFactory } from "./generator/generator_factory.ts";
import { textToMP3 } from "./tts/text_to_speech.ts";

// This is a batch command to update specific site feeds

const generateForSite = async (site: string) => {
  const generator = BriefCastGeneratorFactory(site, { useCache: true, languageCode: LanguageCode.enUS });
  console.log(`get feed for ${site} ... `);
  const item = await generator.getLatest();
  if (!item) {
    console.log(`failed to get the feed. SKIP.`);
    return;
  }
  console.log(item.transcript);

  if (item.isUpdated == false) {
    console.log("feed is not updated. SKIP.");
    return;
  }

  console.log("summarize by gpt3 ... ");
  const briefTranscript = await generator.summarize(item);
  console.log(briefTranscript);
  console.log(briefTranscript.length);

  if (briefTranscript.length == 0) {
    console.warn("transcript is empty, something went wrong.");
    return;
  }

  await textToMP3({
    text: briefTranscript,
    languageCode: generator.options.languageCode,
    fileNamePrefix: site,
  });
};

(async () => {
  const sites = Deno.args.length == 0 ? ["cnn", "nhk"] : Deno.args[0].split(",");

  try {
    for (const site of sites) {
      await generateForSite(site);
    }
  } catch (e) {
    console.error(e);
  }
})();
