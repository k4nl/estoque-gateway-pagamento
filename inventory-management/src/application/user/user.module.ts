import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import {
  CreateUserService,
  GetAllUsersService,
  GetUserService,
} from './services';
import { UserRepository } from './repositories/user.repository';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    CreateUserService,
    GetUserService,
    GetAllUsersService,
    UserRepository,
  ],
  exports: [],
})
export class UserModule {}
