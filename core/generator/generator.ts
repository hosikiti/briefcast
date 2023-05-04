import { FeedData } from "../deps.ts";
import { GenerateOption } from "./generator_factory.ts";

export interface BriefCastItem {
  feed: FeedData;
  content: string;
}

export interface TranscriptResult {
  transcript: string;
  cacheKey: string;
}

export interface BriefCastGenerator {
  getLatest(): Promise<BriefCastItem | null>;
  makeTranscript(feed: BriefCastItem): Promise<TranscriptResult>;
  get options(): GenerateOption;
}
