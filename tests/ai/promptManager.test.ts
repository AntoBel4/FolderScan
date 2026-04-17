import { PromptManager } from '../../src/ai/promptManager';

describe('PromptManager', () => {
  test('formats prompt with variables', () => {
    const manager = new PromptManager();
    const template = {
      systemPrompt: 'You are an AI assistant.',
      userPrompt: 'Analyze ${content} from ${source}.',
    };

    const formatted = manager.formatPrompt(template, {
      content: 'some code',
      source: 'file.js',
    });

    expect(formatted).toContain('Analyze some code from file.js');
  });

  test('validates JSON response against schema', () => {
    const manager = new PromptManager();
    const schema = {
      type: 'object',
      properties: {
        summary: { type: 'string' },
        score: { type: 'number' },
      },
      required: ['summary'],
    };

    const validResponse = '{"summary": "Good code", "score": 8}';
    const invalidResponse = '{"summary": 123}';

    expect(manager.validateResponse(validResponse, schema)).toBe(true);
    expect(manager.validateResponse(invalidResponse, schema)).toBe(false);
  });

  test('repairs JSON response', () => {
    const manager = new PromptManager();
    const messyResponse = 'Here is the result: {"summary": "Test"} and some text';
    const repaired = manager.repairJsonResponse(messyResponse);

    expect(repaired).toBe('{"summary": "Test"}');
  });
});