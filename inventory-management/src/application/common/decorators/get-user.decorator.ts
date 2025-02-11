import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/@core/domain/user/user.domain';

export const GetUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as User;
  },
);
