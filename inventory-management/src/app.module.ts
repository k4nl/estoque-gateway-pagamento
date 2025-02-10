import { Module } from '@nestjs/common';
import { UserModule } from './application/user/user.module';
import { DatabaseModule } from './config/database/database.module';
import { AuthModule } from './application/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import {
  RolesGuard,
  MockRolesGuard,
} from './application/auth/guards/role.guard';

const is_production = process.env.NODE_ENV === 'production';

@Module({
  imports: [DatabaseModule, AuthModule, UserModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: is_production ? RolesGuard : MockRolesGuard,
    },
  ],
})
export class AppModule {}
