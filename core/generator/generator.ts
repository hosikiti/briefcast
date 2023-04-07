import { FeedData } from "../deps.ts";
import { GenerateOption } from "./generator_factory.ts";

export interface BriefCastItem {
  feed: FeedData;
  content: string;
}

export interface BriefCastGenerator {
  getLatest(): Promise<BriefCastItem | null>;
  summarize(feed: BriefCastItem): Promise<string>;
  get options(): GenerateOption;
}
