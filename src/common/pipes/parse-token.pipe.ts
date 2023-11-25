import { Injectable, PipeTransform } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ParseTokenPipe implements PipeTransform {
  constructor(private config: ConfigService) {}

  async transform() {
    console.log(
      'This . config ',
      this.config.get('TOKEN_NAME', process.env.TOKEN_NAME),
    );

    return this.config.get('TOKEN_NAME', process.env.TOKEN_NAME);
  }
}
