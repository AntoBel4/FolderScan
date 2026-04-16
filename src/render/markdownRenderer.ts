import * as fs from 'fs-extra';
import * as path from 'path';
import { FileInfo } from '../core/scanner';

export interface ReportConfig {
  title?: string;
  includeMetadata?: boolean;
  includeStats?: boolean;
  maxFilesToList?: number;
}

export interface FolderReport {
  folderPath: string;
  fileCount: number;
  files: FileInfo[];
  totalSize: number;
  markdown: string;
}

export class MarkdownRenderer {
  async renderFolderReport(
    folderPath: string,
    files: FileInfo[],
    config: ReportConfig = {}
  ): Promise<FolderReport> {
    const {
      title = path.basename(folderPath),
      includeMetadata = true,
      includeStats = true,
      maxFilesToList = 100,
    } = config;

    const totalSize = files.reduce((sum, f) => sum + f.size, 0);
    const markdown = this.generateMarkdown(
      title,
      files,
      totalSize,
      includeMetadata,
      includeStats,
      maxFilesToList
    );

    return {
      folderPath,
      fileCount: files.length,
      files,
      totalSize,
      markdown,
    };
  }

  async generateGlobalReport(
    reports: FolderReport[],
    config: ReportConfig = {}
  ): Promise<string> {
    const { title = 'FolderScope Report' } = config;

    let markdown = `# ${title}\n\n`;
    markdown += `Generated: ${new Date().toISOString()}\n\n`;

    markdown += '## Summary\n\n';
    markdown += `- Total Folders: ${reports.length}\n`;
    const totalFiles = reports.reduce((sum, r) => sum + r.fileCount, 0);
    markdown += `- Total Files: ${totalFiles}\n`;
    const totalSize = reports.reduce((sum, r) => sum + r.totalSize, 0);
    markdown += `- Total Size: ${this.formatBytes(totalSize)}\n\n`;

    markdown += '## Folders\n\n';
    for (const report of reports) {
      markdown += `### ${report.folderPath}\n\n`;
      markdown += `- Files: ${report.fileCount}\n`;
      markdown += `- Size: ${this.formatBytes(report.totalSize)}\n\n`;
    }

    return markdown;
  }

  private generateMarkdown(
    title: string,
    files: FileInfo[],
    totalSize: number,
    includeMetadata: boolean,
    includeStats: boolean,
    maxFilesToList: number
  ): string {
    let markdown = `# ${title}\n\n`;

    if (includeStats) {
      markdown += `## Statistics\n\n`;
      markdown += `- Files: ${files.length}\n`;
      markdown += `- Total Size: ${this.formatBytes(totalSize)}\n`;
      markdown += `- Average Size: ${this.formatBytes(totalSize / files.length)}\n\n`;
    }

    markdown += `## Files\n\n`;
    const filesToShow = files.slice(0, maxFilesToList);
    for (const file of filesToShow) {
      markdown += `- \`${file.path}\` (${this.formatBytes(file.size)})\n`;
    }

    if (files.length > maxFilesToList) {
      markdown += `\n... and ${files.length - maxFilesToList} more files\n`;
    }

    if (includeMetadata) {
      markdown += `\n## Metadata\n\n`;
      markdown += `Generated: ${new Date().toISOString()}\n`;
    }

    return markdown;
  }

  async writeReport(report: FolderReport, outputPath: string): Promise<void> {
    await fs.ensureDir(path.dirname(outputPath));
    await fs.writeFile(outputPath, report.markdown, 'utf-8');
  }

  async writeGlobalReport(markdown: string, outputPath: string): Promise<void> {
    await fs.ensureDir(path.dirname(outputPath));
    await fs.writeFile(outputPath, markdown, 'utf-8');
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}