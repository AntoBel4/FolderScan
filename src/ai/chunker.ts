export interface Chunk {
  text: string;
  index: number;
  total: number;
}

export class Chunker {
  private chunkSize: number;
  private overlap: number;

  constructor(chunkSize: number = 1000, overlap: number = 100) {
    this.chunkSize = chunkSize;
    this.overlap = overlap;
  }

  chunk(text: string): Chunk[] {
    const chunks: Chunk[] = [];
    let start = 0;
    let index = 0;

    while (start < text.length) {
      const end = Math.min(start + this.chunkSize, text.length);
      const chunkText = text.substring(start, end);
      chunks.push({
        text: chunkText,
        index,
        total: Math.ceil(text.length / this.chunkSize),
      });

      start += this.chunkSize - this.overlap;
      if (start >= text.length) break;
      index++;
    }

    return chunks;
  }
}