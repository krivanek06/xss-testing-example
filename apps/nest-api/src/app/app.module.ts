import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { FakeDatabaseService } from './database/fake-database.service';

@Module({
  imports: [
    JwtModule.register({
      global: true, // makes it available everywhere without re-importing
      secret: 'SUPER_SECRET_KEY_123',
      signOptions: { expiresIn: '2d' },
    }),
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, FakeDatabaseService],
})
export class AppModule {}
