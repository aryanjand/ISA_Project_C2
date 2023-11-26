import { ApiProperty } from '@nestjs/swagger';

export class EditStory {
  @ApiProperty({ type: 'integer', description: 'The ID of the story' })
  story_id: number;

  @ApiProperty({
    type: 'string',
    maxLength: 1000,
    description: 'The text of the story generated and to be edited',
  })
  story_text: string;
}
