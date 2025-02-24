import { Controller, Get, Param, Query } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserEvents } from '../events/user.events';
import { UserIdDTO } from '../dto/user-id.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserType } from 'src/@core/common/user-type';
import {
  GetAllUsersService,
  GetUserService,
  CreateUserService,
} from '../services';
import { GetAllUsersFilterDTO } from '../dto/get-all-filter.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly getAllUsersService: GetAllUsersService,
    private readonly getUserService: GetUserService,
    private readonly createUserService: CreateUserService,
  ) {}

  @MessagePattern(UserEvents.USER_CREATED)
  handle(data: any) {
    return this.createUserService.execute(data);
  }

  @Roles(UserType.ADMIN)
  @Get(':external_id')
  async get(@Param() param: UserIdDTO) {
    return this.getUserService.execute(param.external_id);
  }

  @Roles(UserType.ADMIN)
  @Get()
  async getUserAllUsers(@Query() filter: GetAllUsersFilterDTO) {
    return this.getAllUsersService.execute(filter);
  }
}
