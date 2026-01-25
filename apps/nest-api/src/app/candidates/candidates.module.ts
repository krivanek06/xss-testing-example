import { Module } from '@nestjs/common';
import { FakeDatabaseModule } from '../database/fake-database.module';
import { CandidatesController } from './candidates.controller';
import { CandidatesService } from './candidates.service';

@Module({
  imports: [FakeDatabaseModule],
  controllers: [CandidatesController],
  providers: [CandidatesService],
})
export class CandidatesModule {}
