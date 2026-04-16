import { MarkdownRenderer, FolderReport } from '../../src/render/markdownRenderer';
import * as path from 'path';
import * as fs from 'fs-extra';

describe('MarkdownRenderer', () => {
  let renderer: MarkdownRenderer;
  const testOutputDir = path.join(__dirname, '../tmp/render');

  beforeEach(() => {
    renderer = new MarkdownRenderer();
  });

  afterEach(async () => {
    await fs.remove(testOutputDir);
  });

  test('renders folder report with basic info', async () => {
    const files = [
      { path: 'file1.txt', size: 100, mtime: new Date() },
      { path: 'file2.txt', size: 200, mtime: new Date() },
    ];

    const report = await renderer.renderFolderReport('/test', files, {
      title: 'Test Folder',
      includeStats: true,
    });

    expect(report.markdown).toContain('# Test Folder');
    expect(report.markdown).toContain('file1.txt');
    expect(report.markdown).toContain('file2.txt');
    expect(report.fileCount).toBe(2);
    expect(report.totalSize).toBe(300);
  });

  test('formats bytes correctly', async () => {
    const files = [{ path: 'large.bin', size: 1024 * 1024, mtime: new Date() }];

    const report = await renderer.renderFolderReport('/test', files);

    expect(report.markdown).toContain('1 MB');
  });

  test('generates global report from multiple folder reports', async () => {
    const reports: FolderReport[] = [
      {
        folderPath: '/folder1',
        fileCount: 5,
        files: [],
        totalSize: 1000,
        markdown: '',
      },
      {
        folderPath: '/folder2',
        fileCount: 3,
        files: [],
        totalSize: 2000,
        markdown: '',
      },
    ];

    const globalMarkdown = await renderer.generateGlobalReport(reports, {
      title: 'Global Report',
    });

    expect(globalMarkdown).toContain('# Global Report');
    expect(globalMarkdown).toContain('Total Folders: 2');
    expect(globalMarkdown).toContain('Total Files: 8');
    expect(globalMarkdown).toContain('/folder1');
    expect(globalMarkdown).toContain('/folder2');
  });

  test('writes report to file', async () => {
    const files = [{ path: 'test.txt', size: 100, mtime: new Date() }];
    const report = await renderer.renderFolderReport('/test', files);

    const outputFile = path.join(testOutputDir, 'report.md');
    await renderer.writeReport(report, outputFile);

    const content = await fs.readFile(outputFile, 'utf-8');
    expect(content).toContain('test.txt');
  });

  test('limits files shown in report', async () => {
    const files = Array.from({ length: 150 }, (_, i) => ({
      path: `file${i}.txt`,
      size: 100,
      mtime: new Date(),
    }));

    const report = await renderer.renderFolderReport('/test', files, {
      maxFilesToList: 100,
    });

    expect(report.markdown).toContain('file0.txt');
    expect(report.markdown).toContain('file99.txt');
    expect(report.markdown).not.toContain('file100.txt');
    expect(report.markdown).toContain('50 more files');
  });
});