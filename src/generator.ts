export interface BriefCastGenerator {
  getTranscript(): Promise<string>;
  summarize(text: string): Promise<string>;
}
