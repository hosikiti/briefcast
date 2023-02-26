import { BriefCastGenerator } from "./generator.ts";
import { CNNGenerator } from "./sites/cnn.ts";
import { NHKGenerator } from "./sites/nhk.ts";

export const BriefCastGeneratorFactory = (
  siteName: string,
): BriefCastGenerator => {
  switch (siteName) {
    case "nhk":
      return new NHKGenerator();
    case "cnn":
      return new CNNGenerator();
    default:
      throw new Error("unsupported site");
  }
};
