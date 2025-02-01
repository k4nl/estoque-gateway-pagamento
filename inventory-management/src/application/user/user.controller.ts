import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Userservice } from './user.service';
import { UserEvents } from './events/user.events';

@Controller()
export class UserController {
  constructor(private readonly userService: Userservice) {}

  @MessagePattern(UserEvents.USER_CREATED)
  handle(data: any) {
    return this.userService.create(data);
  }
}
