import { Module } from '@nestjs/common';
import { UserModule } from './application/user/user.module';
import { DatabaseModule } from './config/database/database.module';
import { APP_GUARD } from '@nestjs/core';
import { CategoryModule } from './application/category/category.module';
import { AuthModule } from './@core/application/auth/auth.module';
import { JwtAuthGuard } from './@core/application/auth/guards/jwt.guard';
import {
  MockRolesGuard,
  RolesGuard,
} from './@core/application/auth/guards/role.guard';

const is_production = process.env.NODE_ENV === 'production';

@Module({
  imports: [DatabaseModule, AuthModule, UserModule, CategoryModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: is_production ? RolesGuard : MockRolesGuard,
    },
  ],
})
export class AppModule {}
