// open-ai.service.ts
import { Injectable, Global } from '@nestjs/common';
const endpoint = 'https://api.openai.com/v1/engines/davinci/completions';

@Global()
@Injectable()
export class OpenAiService {

async openAiResponse(prompt: String) {
        const data = {
            prompt: `Create a Dungeons and Dragons story based on these details I'll be providing: ${prompt}`,
            max_tokens: 200, 
        };
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.OPEN_AI_API_KEY}`,
            },
            body: JSON.stringify(data),
        });
        
        const result = await response.json();
        const generatedText = result.choices[0].text.trim();
        
        return generatedText;
    }
}
