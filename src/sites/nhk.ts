import { BriefCastGenerator } from "../generator.ts";

export class NHKGenerator implements BriefCastGenerator {
  getTranscript(): Promise<string> {
    throw new Error("Method not implemented.");
  }
}
