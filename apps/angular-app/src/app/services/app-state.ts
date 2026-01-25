import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, delay, map, of } from 'rxjs';
import { Candidate, CandidateStatusFilter, User } from './data.model';

type AppStateModel = {
  user: User | null;
  token: string | null;
};

@Injectable({
  providedIn: 'root',
})
export class AppState {
  private readonly http = inject(HttpClient);
  private readonly state = signal<AppStateModel>({
    user: null,
    token: null,
  });

  readonly publicState = computed(() => this.state());
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  readonly currentUser = computed(() => this.state().user!);

  private readonly candidateUrl = 'http://localhost:3000/api/candidates';

  getAllCandidates(params?: {
    status?: CandidateStatusFilter;
    offset?: number;
    limit?: number;
    order?: 'latest' | 'oldest';
  }) {
    let httpParams = new HttpParams();

    if (params?.status && params.status !== 'All') {
      httpParams = httpParams.set('status', params.status);
    }
    if (params?.offset) {
      httpParams = httpParams.set('offset', params.offset.toString());
    }
    if (params?.limit) {
      httpParams = httpParams.set('limit', params.limit.toString());
    }
    if (params?.order) {
      httpParams = httpParams.set('order', params.order);
    }

    // load candidates
    return this.http.get<Candidate[]>(this.candidateUrl, { params: httpParams }).pipe(delay(1000));
  }

  createCandidate(candidate: Candidate) {
    return this.http.post<Candidate>(this.candidateUrl, candidate).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  updateCandidate(id: string, candidate: Partial<Candidate>) {
    return this.http.put<void>(`${this.candidateUrl}/${id}`, candidate);
  }

  deleteCandidate(id: string) {
    return this.http.delete<void>(`${this.candidateUrl}/${id}`);
  }

  setData<T extends keyof AppStateModel>(key: T, value: AppStateModel[T]) {
    this.state.set({
      ...this.state(),
      [key]: value,
    });
  }
}
