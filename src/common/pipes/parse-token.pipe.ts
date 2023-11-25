import { Injectable, PipeTransform } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ParseTokenPipe implements PipeTransform {
  constructor(private config: ConfigService) {}

  async transform() {
    console.log("token_transform", this.config.get('TOKEN_NAME', 'aryan.sid'));
    return this.config.get('TOKEN_NAME', 'aryan.sid');
  }
}