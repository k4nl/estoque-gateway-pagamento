import { Controller, Get, Param, Query } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Userservice } from './user.service';
import { UserEvents } from './events/user.events';
import { UserIdDTO } from './dto/user-id.dto';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from 'src/@core/domain/user/user.domain';
import { Roles } from '../common/decorators/roles.decorator';
import { UserType } from 'src/@core/common/user-type';
import { GetAllUsersService } from './services/get-all-users.service';
import { GetAllUsersFilterDTO } from './dto/get-all-filter.dto';
import { GetUserService } from './services/get-user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: Userservice,
    private readonly getAllUsersService: GetAllUsersService,
    private readonly getUserService: GetUserService,
  ) {}

  @MessagePattern(UserEvents.USER_CREATED)
  handle(data: any) {
    return this.userService.create(data);
  }

  @Roles(UserType.ADMIN)
  @Get(':external_id')
  async get(@Param() param: UserIdDTO, @GetUser() user: User) {
    return this.getUserService.execute(param.external_id, user);
  }

  @Roles(UserType.ADMIN)
  @Get()
  async getUserAllUsers(@Query() filter: GetAllUsersFilterDTO) {
    return this.getAllUsersService.execute(filter);
  }
}
