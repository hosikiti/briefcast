import { asserts } from "../deps.ts";
import { splitJapanese } from "./text_splitter.ts";

Deno.test("split long Japanese", () => {
  const tests = [
    { input: `あああ、あああ、あああ`, limit: 10, expect: ["あああ、あああ", "あああ"] },
    { input: `あああ、あああ、あああ`, limit: 5, expect: ["あああ", "あああ", "あああ"] },
    { input: `ああああああ`, limit: 5, expect: ["ああああああ"] },
    {
      input: `ああああああ、いいい、い、い、うううう`,
      limit: 5,
      expect: ["ああああああ", "いいい、い", "い", "うううう"],
    },
    {
      input:
        `BriefCastは、どんなWebサイトからでもポッドキャストを生成できるWebサービスで、iOS、Android、Webを合わせて、100万人が毎日使っています。`,
      limit: 60,
      expect: [
        "BriefCastは、どんなWebサイトからでもポッドキャストを生成できるWebサービスで、iOS、Android",
        "Webを合わせて、100万人が毎日使っています",
      ],
    },
  ];

  for (const t of tests) {
    asserts.assertEquals(splitJapanese(t.input, t.limit), t.expect);
  }
});
