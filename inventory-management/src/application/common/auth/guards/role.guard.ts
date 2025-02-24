import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserType } from 'src/@core/common/user-type';
import { ROLES_KEY } from 'src/application/common/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const required_roles = this.reflector.getAllAndOverride<UserType[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!required_roles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    const has_role = required_roles.some((role) => role === user.user_type);

    if (!has_role) {
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'You do not have permission',
      });
    }

    return true;
  }
}

@Injectable()
export class MockRolesGuard implements CanActivate {
  canActivate() {
    return true;
  }
}
