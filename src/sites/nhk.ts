import { parse } from "https://deno.land/x/xml/mod.ts";
import { BriefCastGenerator } from "../generator.ts";
import { gptSummarizer } from "../openai/summarizer.ts";

const feedXml = "https://www.nhk.or.jp/rss/news/cat0.xml";

interface NHKFeedItem {
  title: string;
  description: string;
}

interface NHKFeed {
  title: string;
  item: NHKFeedItem[];
}

interface NHKFeedRSS {
  channel: NHKFeed;
}

export class NHKGenerator implements BriefCastGenerator {
  async getTranscript(): Promise<string> {
    const resp = await fetch(feedXml);
    const data = parse(await resp.text());
    const rss = (data.rss as unknown) as NHKFeedRSS;
    const feed = rss.channel;
    const result: string[] = [];
    feed.item.forEach((item) => {
      result.push(item.title + ": " + item.description);
    });
    return result.join(" ");
  }

  async summarize(text: string): Promise<string> {
    return await gptSummarizer(text);
  }
}
