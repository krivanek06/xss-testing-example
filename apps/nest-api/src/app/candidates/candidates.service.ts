import { Injectable } from '@nestjs/common';
import { FakeDatabaseService } from '../database/fake-database.service';
import { Candidate, CandidateDTO } from '../database/seed-data.model';

@Injectable()
export class CandidatesService {
  constructor(private fakeDatabaseService: FakeDatabaseService) {}

  getAllCandidates(body: {
    status?: Candidate['status'];
    offset?: number;
    limit?: number;
    order?: 'latest' | 'oldest';
  }) {
    const candidates = this.fakeDatabaseService
      .getAllType('candidates')
      .sort((a, b) => {
        if (body.order === 'latest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
      })
      .filter(candidate => (body.status ? candidate.status === body.status : true));

    const start = body.offset || 0;
    const end = body.limit ? start + body.limit : undefined;

    return candidates.slice(start, end);
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
