import { BriefCastGeneratorFactory } from "./generator_factory.ts";

(async () => {
  const generator = BriefCastGeneratorFactory("nhk");
  console.log("get feed ... ");
  const transcript = await generator.getTranscript();
  console.log("summarize by gpt3 ... ");
  const briefTranscript = await generator.summarize(transcript);
  console.log(transcript);
  console.log("-----");
  console.log(briefTranscript);
})();
