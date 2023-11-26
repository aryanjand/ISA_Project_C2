import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class StoryDto {
  @ApiProperty({ type: 'integer', description: 'The ID of the story' })
  id: number;

  @ApiProperty({
    type: 'integer',
    description: 'The ID of the user associated with the story',
  })
  user_id: number;

  @ApiProperty({
    type: 'string',
    maxLength: 50,
    description: 'Text provided from the user',
  })
  user_text: string;

  @ApiProperty({
    type: 'string',
    maxLength: 1000,
    description: 'The text of the story generated',
  })
  story_text: string;
}
