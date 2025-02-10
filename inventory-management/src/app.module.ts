import { Module } from '@nestjs/common';
import { UserModule } from './application/user/user.module';
import { DatabaseModule } from './config/database/database.module';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
