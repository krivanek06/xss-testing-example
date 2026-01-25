import { Module } from '@nestjs/common';
import { FakeDatabaseService } from './fake-database.service';

@Module({
  imports: [],
  exports: [FakeDatabaseService],
  providers: [FakeDatabaseService],
})
export class FakeDatabaseModule {}
