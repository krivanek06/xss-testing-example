import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { FakeDatabaseService } from './database/fake-database.service';

@Module({
  imports: [],
  controllers: [AppController, AuthController],
  providers: [AppService, FakeDatabaseService],
})
export class AppModule {}
