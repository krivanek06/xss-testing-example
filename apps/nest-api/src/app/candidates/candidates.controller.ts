import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import type { Candidate, CandidateDTO } from '../database/seed-data.model';
import { CandidatesService } from './candidates.service';

@Controller('candidates')
export class CandidatesController {
  constructor(private candidatesService: CandidatesService) {}

  @Get()
  getAllCandidates(@Query() status: Candidate['status'], @Query() offset: number, @Query() limit: number) {
    return this.candidatesService.getAllCandidates({ status, offset, limit });
  }

  @Post()
  createCandidate(@Body() candidate: CandidateDTO) {
    this.candidatesService.createCandidate(candidate);
  }

  @Put(':id')
  updateCandidate(@Param('id') id: string, @Body() candidate: Partial<CandidateDTO>) {
    this.candidatesService.updateCandidate(id, candidate);
  }

  @Delete(':id')
  deleteCandidate(@Param('id') id: string) {
    this.candidatesService.deleteCandidate(id);
  }
}
