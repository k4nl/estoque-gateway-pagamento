import { Module } from '@nestjs/common';
import { Userservice } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [Userservice],
  exports: [Userservice],
})
export class UserModule {}
