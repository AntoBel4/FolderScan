import Ajv from 'ajv';

export interface PromptTemplate {
  systemPrompt: string;
  userPrompt: string;
  schema?: any; // JSON schema for response validation
}

export class PromptManager {
  private ajv: Ajv;

  constructor() {
    this.ajv = new Ajv();
  }

  formatPrompt(template: PromptTemplate, variables: Record<string, any>): string {
    let prompt = template.systemPrompt + '\n\n' + template.userPrompt;

    for (const [key, value] of Object.entries(variables)) {
      prompt = prompt.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), String(value));
    }

    if (template.schema) {
      prompt += '\n\nRespond with valid JSON matching this schema:\n' + JSON.stringify(template.schema, null, 2);
    }

    return prompt;
  }

  validateResponse(response: string, schema: any): boolean {
    try {
      const parsed = JSON.parse(response);
      const validate = this.ajv.compile(schema);
      return validate(parsed);
    } catch {
      return false;
    }
  }

  repairJsonResponse(response: string): string {
    // Simple repair: try to extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        JSON.parse(jsonMatch[0]);
        return jsonMatch[0];
      } catch {
        // If still invalid, return original
      }
    }
    return response;
  }
}