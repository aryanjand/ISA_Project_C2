import { ParseTokenPipe } from '../pipes/parse-token.pipe';
import { Cookies } from './cookie.decorator';

export const TokenCookie = (data?: string) => Cookies(data, ParseTokenPipe);