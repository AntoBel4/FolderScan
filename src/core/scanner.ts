// src/core/scanner.ts
import * as fs from "fs";
import * as path from "path";

export async function scanFolder(root: string) {
  const entries = fs.readdirSync(root, { withFileTypes: true });
  const files = entries.map(e => ({
    name: e.name,
    isDir: e.isDirectory()
  }));
  return { root, files };
}

export default scanFolder;
