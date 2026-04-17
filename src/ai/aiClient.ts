import axios, { AxiosInstance } from 'axios';

export interface AIConfig {
  provider: 'openai' | 'mock';
  apiKey?: string;
  model: string;
  baseURL?: string;
  concurrency?: number;
}

export interface AIResponse {
  text: string;
  usage?: any;
}

export class AIClient {
  private client?: AxiosInstance;
  private config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;

    if (config.provider === 'mock' || !config.apiKey) {
      this.config.provider = 'mock';
    } else {
      this.client = axios.create({
        baseURL: config.baseURL || 'https://api.openai.com/v1',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
    }
  }

  async generate(prompt: string): Promise<AIResponse> {
    if (this.config.provider === 'mock') {
      return this.mockResponse(prompt);
    }

    const response = await this.client!.post('/chat/completions', {
      model: this.config.model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
    });

    return {
      text: response.data.choices[0].message.content,
      usage: response.data.usage,
    };
  }

  private mockResponse(prompt: string): AIResponse {
    // Simple mock response
    return {
      text: `Mock AI response for: ${prompt.substring(0, 50)}...`,
    };
  }
}