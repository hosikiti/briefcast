import { CNNGenerator } from "./cnn.ts";
import { BriefCastGenerator } from "./generator.ts";
import { NHKGenerator } from "./nhk.ts";
import { RSSGenerator } from "./rss_generator.ts";

export interface GenerateOption {
  useCache: boolean;
  feedUrl?: string;
  languageCode: string;
}

export const BriefCastGeneratorFactory = (
  siteNameOrUrl: string,
  opts?: GenerateOption,
): BriefCastGenerator => {
  switch (siteNameOrUrl) {
    case "nhk":
      return new NHKGenerator(opts);
    case "cnn":
      return new CNNGenerator(opts);
    default:
      if (siteNameOrUrl.startsWith("http")) {
        opts = opts || {
          languageCode: "",
          useCache: true,
        };
        opts.feedUrl = siteNameOrUrl;
        return new RSSGenerator(opts);
      }
      throw new Error("unsupported site");
  }
};
