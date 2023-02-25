import { BriefCastGenerator } from "./generator.ts";
import { NHKGenerator } from "./sites/nhk.ts";

export const BriefCastGeneratorFactory = (
  siteName: string,
): BriefCastGenerator => {
  switch (siteName) {
    case "nhk":
      return new NHKGenerator();
    default:
      throw new Error("unsupported site");
  }
};
