import { asserts } from "../../deps.ts";
import { parseFeed } from "./feed_parser.ts";

Deno.test("parse RSS version 2 feed", async () => {
  const feed = await parseFeed("https://www.feedforall.com/sample.xml");
  asserts.assertExists(feed);
  asserts.assertExists(feed!.entries);
});

Deno.test("parse RSS version 1 feed", async () => {
  const feed = await parseFeed("https://assets.wor.jp/rss/rdf/nikkei/news.rdf");
  asserts.assertExists(feed);
  asserts.assertExists(feed!.entries);
});
