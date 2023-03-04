import { BriefCastGenerator } from "./generator.ts";
import { CNNGenerator } from "./sites/cnn.ts";
import { NHKGenerator } from "./sites/nhk.ts";

export interface GenerateOption {
  useCache: boolean;
}

export const BriefCastGeneratorFactory = (
  siteName: string,
  opts?: GenerateOption,
): BriefCastGenerator => {
  switch (siteName) {
    case "nhk":
      return new NHKGenerator(opts);
    case "cnn":
      return new CNNGenerator(opts);
    default:
      throw new Error("unsupported site");
  }
};
