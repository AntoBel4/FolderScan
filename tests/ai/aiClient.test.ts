import { AIClient, AIConfig } from '../../src/ai/aiClient';

describe('AIClient', () => {
  test('uses mock when no apiKey', async () => {
    const config: AIConfig = {
      provider: 'openai',
      model: 'gpt-4',
      // no apiKey
    };

    const client = new AIClient(config);
    const response = await client.generate('Test prompt');

    expect(response.text).toContain('Mock AI response');
  });

  test('mock response includes prompt snippet', async () => {
    const config: AIConfig = {
      provider: 'mock',
      model: 'gpt-4',
    };

    const client = new AIClient(config);
    const response = await client.generate('Analyze this code');

    expect(response.text).toContain('Analyze this code');
  });
});