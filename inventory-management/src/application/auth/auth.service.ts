import { CanActivate, Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  canActivate() {
    return true;
  }
}
