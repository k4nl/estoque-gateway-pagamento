import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [AuthService],
  exports: [],
})
export class AuthModule {}
