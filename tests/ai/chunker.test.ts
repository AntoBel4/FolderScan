import { Chunker } from '../../src/ai/chunker';

describe('Chunker', () => {
  test('chunks text into pieces', () => {
    const chunker = new Chunker(10, 2);
    const text = 'This is a test';
    const chunks = chunker.chunk(text);

    expect(chunks.length).toBe(2);
    expect(chunks[0].text).toBe('This is a ');
    expect(chunks[1].text).toBe('a test');
  });

  test('overlaps chunks correctly', () => {
    const chunker = new Chunker(5, 2);
    const text = 'abcdefghij';
    const chunks = chunker.chunk(text);

    expect(chunks[0].text).toBe('abcde');
    expect(chunks[1].text).toBe('defgh');
  });
});