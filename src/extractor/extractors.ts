import * as fs from 'fs-extra';
import * as path from 'path';
// @ts-ignore
import pdfParse from 'pdf-parse';
// @ts-ignore
import * as mammoth from 'mammoth';
import * as yaml from 'js-yaml';
import { lookup } from 'mime-types';

export interface ExtractResult {
  text: string;
  metadata?: any;
}

export async function extractText(filePath: string): Promise<ExtractResult> {
  const ext = path.extname(filePath).toLowerCase();
  const mimeType = lookup(filePath) || '';

  if (ext === '.txt' || ext === '.md' || isCodeFile(ext)) {
    return await extractPlainText(filePath);
  } else if (mimeType === 'application/pdf' || ext === '.pdf') {
    return await extractPdfText(filePath);
  } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || ext === '.docx') {
    return await extractDocxText(filePath);
  } else if (mimeType === 'application/json' || ext === '.json') {
    return await extractJsonText(filePath);
  } else if (mimeType === 'application/x-yaml' || ext === '.yaml' || ext === '.yml') {
    return await extractYamlText(filePath);
  } else {
    // Fallback to plain text
    return await extractPlainText(filePath);
  }
}

function isCodeFile(ext: string): boolean {
  const codeExts = ['.js', '.ts', '.py', '.java', '.cpp', '.c', '.h', '.html', '.css', '.xml', '.sh', '.sql'];
  return codeExts.includes(ext);
}

async function extractPlainText(filePath: string): Promise<ExtractResult> {
  const content = await fs.readFile(filePath, 'utf-8');
  return { text: content };
}

async function extractPdfText(filePath: string): Promise<ExtractResult> {
  const buffer = await fs.readFile(filePath);
  // @ts-ignore
  const data = await pdfParse(buffer);
  return { text: data.text, metadata: { pages: data.numpages, info: data.info } };
}

async function extractDocxText(filePath: string): Promise<ExtractResult> {
  const result = await mammoth.extractRawText({ path: filePath });
  return { text: result.value, metadata: { messages: result.messages } };
}

async function extractJsonText(filePath: string): Promise<ExtractResult> {
  const content = await fs.readFile(filePath, 'utf-8');
  const obj = JSON.parse(content);
  // Extract text from JSON (simple stringification for now)
  const text = JSON.stringify(obj, null, 2);
  return { text, metadata: { type: 'json' } };
}

async function extractYamlText(filePath: string): Promise<ExtractResult> {
  const content = await fs.readFile(filePath, 'utf-8');
  const obj = yaml.load(content) as any;
  // Extract text from YAML (stringification)
  const text = yaml.dump(obj);
  return { text, metadata: { type: 'yaml' } };
}