import { Injectable } from '@nestjs/common';
import { FakeDatabaseService } from '../database/fake-database.service';
import { Candidate, CandidateDTO } from '../database/seed-data.model';

@Injectable()
export class CandidatesService {
  constructor(private fakeDatabaseService: FakeDatabaseService) {}

  getAllCandidates(body: { status: Candidate['status']; offset: number; limit: number }) {
    console.log('Fetching all candidates', {
      status: body.status,
      offset: body.offset,
      limit: body.limit,
    });

    return this.fakeDatabaseService.getAllType('candidates');
  }

  createCandidate(candidate: CandidateDTO) {
    const randomId = Math.random().toString(36).substring(2, 15);

    const candidateToDB = {
      id: randomId,
      ...candidate,
    } satisfies Candidate;

    this.fakeDatabaseService.add('candidates', candidateToDB);

    return candidate;
  }

  updateCandidate(id: string, candidate: Partial<CandidateDTO>) {
    this.fakeDatabaseService.update('candidates', id, candidate);
    console.log('Updating candidate:', candidate);
  }

  deleteCandidate(id: string) {
    this.fakeDatabaseService.deleteItem('candidates', id);
    console.log('Deleting candidate with id:', id);
  }
}
