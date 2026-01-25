import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { CandidatesModule } from './candidates/candidates.module';
import { FakeDatabaseModule } from './database/fake-database.module';

@Module({
  imports: [
    JwtModule.register({
      global: true, // makes it available everywhere without re-importing
      secret: 'SUPER_SECRET_KEY_123',
      signOptions: { expiresIn: '2d' },
    }),
    CandidatesModule,
    FakeDatabaseModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
