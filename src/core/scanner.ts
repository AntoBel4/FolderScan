import * as fs from 'fs';

export async function scanFolder(root: string) {
  const entries = fs.readdirSync(root, { withFileTypes: true });
  const files = entries.map(e => ({ name: e.name, isDir: e.isDirectory() }));
  return { root, files };
}

export default scanFolder;
