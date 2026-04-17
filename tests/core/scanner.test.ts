import { Scanner, ScanOptions } from '../../src/core/scanner';
import * as fs from 'fs-extra';
import * as path from 'path';

describe('Scanner', () => {
  const testDir = path.join(__dirname, '../fixtures');
  const cacheFile = '.folderscope/cache.json';

  beforeEach(async () => {
    // Clean cache before each test
    await fs.remove(cacheFile);
  });

  afterEach(async () => {
    await fs.remove(cacheFile);
  });

  test('scans directory and returns file info', async () => {
    const scanner = new Scanner();
    const options: ScanOptions = {
      exclude: [],
      concurrency: 1,
      cacheEnabled: false,
      useHash: false,
    };

    const result = await scanner.scan(testDir, options);

    expect(result.files).toBeInstanceOf(Array);
    expect(result.files.length).toBeGreaterThan(0);
    expect(result.files[0]).toHaveProperty('path');
    expect(result.files[0]).toHaveProperty('size');
    expect(result.files[0]).toHaveProperty('mtime');
  });

  test('excludes files matching patterns', async () => {
    const scanner = new Scanner();
    const options: ScanOptions = {
      exclude: ['**/*.txt'],
      concurrency: 1,
      cacheEnabled: false,
      useHash: false,
    };

    const result = await scanner.scan(testDir, options);

    const hasTxt = result.files.some(file => file.path.endsWith('.txt'));
    expect(hasTxt).toBe(false);
  });

  test('computes hash when useHash is true', async () => {
    const scanner = new Scanner();
    const options: ScanOptions = {
      exclude: [],
      concurrency: 1,
      cacheEnabled: false,
      useHash: true,
    };

    const result = await scanner.scan(testDir, options);

    expect(result.files[0]).toHaveProperty('hash');
    expect(typeof result.files[0].hash).toBe('string');
  });

  test('uses cache when enabled', async () => {
    const scanner = new Scanner();
    const options: ScanOptions = {
      exclude: [],
      concurrency: 1,
      cacheEnabled: true,
      useHash: true,
    };

    // First scan
    const result1 = await scanner.scan(testDir, options);
    expect(result1.cacheUpdated).toBe(true);

    // Second scan should use cache
    const result2 = await scanner.scan(testDir, options);
    expect(result2.files.length).toBe(result1.files.length);
  });
});