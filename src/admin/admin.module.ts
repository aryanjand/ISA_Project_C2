import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { RequestsService } from 'src/requests/requests.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService, RequestsService], 
})
export class AdminModule {}
