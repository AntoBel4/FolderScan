import * as fs from 'fs-extra';
import * as path from 'path';
import * as crypto from 'crypto';
import { minimatch } from 'minimatch';

export interface FileInfo {
  path: string;
  size: number;
  mtime: Date;
  hash?: string;
}

export interface ScanOptions {
  exclude: string[];
  concurrency: number;
  cacheEnabled: boolean;
  useHash: boolean;
}

export interface ScanResult {
  files: FileInfo[];
  cacheUpdated: boolean;
}

const CACHE_FILE = '.folderscope/cache.json';

export class Scanner {
  private cache: Map<string, { hash?: string; mtime: number }> = new Map();

  constructor() {
    this.loadCache();
  }

  private async loadCache(): Promise<void> {
    try {
      const cacheData = await fs.readJson(CACHE_FILE);
      this.cache = new Map(Object.entries(cacheData));
    } catch (err) {
      // Cache doesn't exist or invalid, start empty
    }
  }

  private async saveCache(): Promise<void> {
    await fs.ensureDir(path.dirname(CACHE_FILE));
    const cacheObj = Object.fromEntries(this.cache);
    await fs.writeJson(CACHE_FILE, cacheObj);
  }

  private shouldExclude(filePath: string, excludePatterns: string[]): boolean {
    return excludePatterns.some(pattern => minimatch(filePath, pattern));
  }

  private async computeHash(filePath: string): Promise<string> {
    const content = await fs.readFile(filePath);
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  private async scanRecursive(
    dirPath: string,
    options: ScanOptions,
    results: FileInfo[]
  ): Promise<void> {
    const items = await fs.readdir(dirPath);

    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const relativePath = path.relative(process.cwd(), fullPath);

      if (this.shouldExclude(relativePath, options.exclude)) {
        continue;
      }

      const stat = await fs.stat(fullPath);

      if (stat.isDirectory()) {
        await this.scanRecursive(fullPath, options, results);
      } else if (stat.isFile()) {
        const cached = this.cache.get(relativePath);
        let hash: string | undefined;

        if (options.useHash) {
          if (options.cacheEnabled && cached && cached.mtime === stat.mtime.getTime()) {
            hash = cached.hash;
          } else {
            hash = await this.computeHash(fullPath);
            this.cache.set(relativePath, { hash, mtime: stat.mtime.getTime() });
          }
        }

        results.push({
          path: relativePath,
          size: stat.size,
          mtime: stat.mtime,
          hash,
        });
      }
    }
  }

  async scan(dirPath: string, options: ScanOptions): Promise<ScanResult> {
    const results: FileInfo[] = [];
    await this.scanRecursive(dirPath, options, results);

    let cacheUpdated = false;
    if (options.cacheEnabled) {
      await this.saveCache();
      cacheUpdated = true;
    }

    return { files: results, cacheUpdated };
  }
}
