import { asserts } from "../deps.ts";
import { getSHA256String } from "./hash.ts";

Deno.test("getSHA256String", () => {
  const result = getSHA256String("hello");
  asserts.assertEquals(result, "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824");
});
