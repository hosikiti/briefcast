import { ensureDirSync } from "https://deno.land/std@0.170.0/fs/ensure_dir.ts";
import { MEDIA_PATH } from "../constant.ts";

// Delete old trial podcasts for saving storage space
export const deleteOldTrialPodcasts = async () => {
  const baseDir = MEDIA_PATH;
  ensureDirSync(baseDir);
  for await (const f of Deno.readDir(baseDir)) {
    if (!f.isFile || !f.name.startsWith("trial")) {
      continue;
    }
    const filePath = baseDir + "/" + f.name;
    const fileInfo = await Deno.stat(filePath);
    console.log(f.name, fileInfo.mtime);
    if (!fileInfo.mtime) {
      return;
    }
    // delete trial podcasts created more than 60 minutes ago.
    const fileTimestamp = +fileInfo.mtime;
    const timeDiffInMinutes = Math.floor((+Date.now()) - fileTimestamp) / (1000 * 60);
    if (timeDiffInMinutes > 60) {
      Deno.removeSync(filePath);
      console.log("old file removed.", filePath);
    }
  }
};
