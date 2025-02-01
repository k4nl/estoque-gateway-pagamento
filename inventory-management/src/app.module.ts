import { Module } from '@nestjs/common';
import { UserModule } from './application/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
