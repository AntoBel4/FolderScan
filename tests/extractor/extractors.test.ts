import { extractText } from '../../src/extractor/extractors';
import * as path from 'path';

const fixturesDir = path.join(__dirname, '../fixtures');

describe('Extractors', () => {
  test('extracts text from .txt file', async () => {
    const filePath = path.join(fixturesDir, 'sample.txt');
    const result = await extractText(filePath);
    expect(result.text).toContain('Sample');
    expect(result.metadata).toBeUndefined();
  });

  test('extracts text from .md file', async () => {
    const filePath = path.join(fixturesDir, 'sample.md');
    const result = await extractText(filePath);
    expect(result.text).toContain('# FolderScope');
  });

  test('extracts text from .json file', async () => {
    const filePath = path.join(fixturesDir, 'sample.json');
    const result = await extractText(filePath);
    expect(result.text).toContain('"name": "FolderScope"');
    expect(result.metadata).toEqual({ type: 'json' });
  });

  test('extracts text from .yaml file', async () => {
    const filePath = path.join(fixturesDir, 'sample.yaml');
    const result = await extractText(filePath);
    expect(result.text).toContain('name: FolderScope');
    expect(result.metadata).toEqual({ type: 'yaml' });
  });

  test('extracts text from .js file (code)', async () => {
    const filePath = path.join(fixturesDir, 'sample.js');
    const result = await extractText(filePath);
    expect(result.text).toContain('function scanFolder');
  });

  // Note: PDF and DOCX tests would require actual files, which are hard to create in text.
  // For now, skip or mock if needed.
});