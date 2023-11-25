// open-ai.service.ts
import { Injectable, Global } from '@nestjs/common';
import OpenAI from 'openai';

@Global()
@Injectable()
export class OpenAiService {
  async openAiResponse(prompt: String): Promise<{prompt: string}> {
    try {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a PG-13 fantasy story writer.',
          },
          {
            role: 'user',
            content: `Write a 150 character fantasy story based on these key words, keep it short: ${prompt}`,
          },
        ],
        temperature: 0.8,
        max_tokens: 200,
      });
      const generatedText = response.choices[0].message.content.trim();
      return {prompt: generatedText};
    } catch (error) {
      console.error('Error in openAiResponse:', error);
      throw new Error('Error generating response from OpenAI API');
    }
  }
}
