import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { RequestsService } from 'src/requests/requests.service';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService, RequestsService, UserService], 
})
export class AdminModule {}
