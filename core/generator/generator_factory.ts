import { LanguageCode } from "../constant.ts";
import { SummarizerRepository } from "../repository/summarizer.ts";
import { BriefCastGenerator } from "./generator.ts";
import { RSSGenerator } from "./rss_generator.ts";

export interface GenerateOption {
  useCache: boolean;
  feedUrl: string;
  prompt?: string;
  languageCode: LanguageCode;
  summarizer: SummarizerRepository;
}

export const BriefCastGeneratorFactory = (
  opts: GenerateOption,
): BriefCastGenerator => {
  return new RSSGenerator(opts);
};
