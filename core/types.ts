import { LanguageCode } from "./constant.ts";
import { Timestamp } from "./deps.ts";

export interface PodcastDefinition {
  [key: string]: string | Timestamp | undefined;
  name: string;
  feedUrl: string;
  language: LanguageCode;
  prompt?: string;
  lastGenerate?: Timestamp;
  lastContentHash?: string;
  authorId: string;
  docId: string;
}
