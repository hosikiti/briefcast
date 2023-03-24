// Check if the path exists in the file system
export const existsSync = (path: string): boolean => {
  try {
    Deno.statSync(path);
  } catch (e) {
    if (e instanceof Deno.errors.NotFound) {
      return false;
    }
  }
  return true;
};
