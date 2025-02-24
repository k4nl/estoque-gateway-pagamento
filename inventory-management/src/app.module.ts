import { Module } from '@nestjs/common';
import { UserModule } from './application/user/user.module';
import { DatabaseModule } from './config/database/database.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { CategoryModule } from './application/category/category.module';
import { TransporterModule } from './config/events/transporter.module';

import { RedisModule } from './config/redis/redis.module';
import { TriggersModule } from './config/database/triggers/triggers.module';
import { InventoryModule } from './application/inventory/inventory.module';
import { ProductModule } from './application/product/product.module';
import { ProductReservationModule } from './application/product-reservation/product-reservation.module';
import { AuthModule } from './application/common/auth/auth.module';
import { JwtAuthGuard } from './application/common/auth/guards/jwt.guard';
import { RolesGuard } from './application/common/auth/guards/role.guard';
import { ErrorFilter } from './@core/application/errors/error-filter';

@Module({
  imports: [
    DatabaseModule,
    TriggersModule,
    TransporterModule,
    RedisModule,
    AuthModule,
    UserModule,
    CategoryModule,
    InventoryModule,
    ProductModule,
    ProductReservationModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
  ],
})
export class AppModule {}
