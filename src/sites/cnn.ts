import { parse } from "https://deno.land/x/xml/mod.ts";
import { BriefCastGenerator } from "../generator.ts";
import { gptSummarizer } from "../openai/summarizer.ts";
import { textToMP3 } from "../tts/text_to_speech.ts";
import { MAX_TRANSCRIPT_LENGTH } from "../update.ts";

const feedXml = "http://rss.cnn.com/rss/edition.rss";

interface CNNFeed {
  channel: CNNFeedChannel;
}

interface CNNFeedChannel {
  item: CNNFeedItem[];
}

interface CNNFeedItem {
  title: string;
  description?: string;
}

export class CNNGenerator implements BriefCastGenerator {
  getLanguageCode(): string {
    return "en-US";
  }
  async getTranscript(): Promise<string> {
    const resp = await fetch(feedXml);
    const body = await resp.text();
    const data = parse(body);
    const rss = (data.rss) as unknown;
    const feed = rss as CNNFeed;

    const result: string[] = [];

    for (let i = 0; i < feed.channel.item.length; i++) {
      const description = feed.channel.item[i].description;
      if (description == null) {
        continue;
      }

      if (
        result.join("\n").length + description.length > MAX_TRANSCRIPT_LENGTH
      ) {
        break;
      }
      result.push(description);
    }

    return result.join("\n");
  }

  async summarize(text: string): Promise<string> {
    // Create intro part
    const now = new Date();
    const month = this.getMonthName(now.getMonth());
    const day = now.getDate();
    const year = now.getFullYear();
    const intro =
      `Welcome to CNN news summary. Today's date is ${month}/${day}/${year}.`;

    // Create closing part
    const closing = " That's all for today's CNN news summary by BriefCast.";

    // Summarize the given text
    const body = await gptSummarizer(text, this.getLanguageCode());

    return intro + body + closing;
  }

  // monthIndex starts from 0
  getMonthName(monthIndex: number): string {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return months[monthIndex];
  }
}
