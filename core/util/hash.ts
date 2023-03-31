import { crypto } from "https://deno.land/std@0.181.0/crypto/mod.ts";
import { bufferToHex } from "https://deno.land/x/hextools/mod.ts";

export const getSHA256String = (s: string): string => {
  const output = crypto.subtle.digestSync("SHA-256", new TextEncoder().encode(s));
  return bufferToHex(output);
};
