// Split Japanese into chunks with the size of limit.
// This use 。 and 、 as split characters.
export const splitJapanese = (s: string, limit: number): string[] => {
  const parts = s.split("。");
  const result = [];
  let buf = "";

  for (const part of parts) {
    const subParts = part.split("、");
    for (const subPart of subParts) {
      if (buf.length + subPart.length < limit) {
        buf += subPart;
      } else {
        if (buf == "") {
          result.push(subPart);
          buf = "";
        } else {
          result.push(buf);
          buf = subPart;
        }
      }
    }
    if (buf) {
      result.push(buf);
      buf = "";
    }
  }

  // concat small chunks into one
  return result.reduce((prev, current) => {
    if (prev.length == 0) {
      prev.push("");
    }
    const last = prev[prev.length - 1];
    if (last.length + current.length < limit) {
      prev[prev.length - 1] = last + current;
      return prev;
    } else {
      prev.push(current);
      return prev;
    }
  }, [] as string[]);
};
