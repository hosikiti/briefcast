import { assertExists } from "https://deno.land/std@0.178.0/testing/asserts.ts"
import { parseFeed } from "../src/generator/common/feed_parser.ts"

Deno.test("parse RSS version 2 feed", async() => {
    const feed = await parseFeed("https://www.feedforall.com/sample.xml")
    assertExists(feed)
    assertExists(feed!.entries)
})

Deno.test("parse RSS version 1 feed", async() => {
    const feed = await parseFeed("https://assets.wor.jp/rss/rdf/nikkei/news.rdf")
    assertExists(feed)
    assertExists(feed!.entries)
})
