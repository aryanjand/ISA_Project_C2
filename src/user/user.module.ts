import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RequestsService } from 'src/requests/requests.service';

@Module({
  providers: [UserService, RequestsService],
  controllers: [UserController],
})
export class UserModule {}
