import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, of, tap } from 'rxjs';
import { Candidate, User } from './data.model';

type AppStateModel = {
  user: User | null;
  token: string | null;
  candidates: Candidate[];
};

@Injectable({
  providedIn: 'root',
})
export class AppState {
  private readonly http = inject(HttpClient);
  private readonly state = signal<AppStateModel>({
    user: null,
    token: null,
    candidates: [],
  });

  readonly publicState = computed(() => this.state());
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  readonly currentUser = computed(() => this.state().user!);

  private readonly candidateUrl = 'http://localhost:3000/api/candidates';

  getAllCandidates(params?: {
    status?: Candidate['status'];
    offset?: number;
    limit?: number;
    order?: 'latest' | 'oldest';
  }): void {
    let httpParams = new HttpParams();

    if (params?.status) {
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
    this.http.get<Candidate[]>(this.candidateUrl, { params: httpParams }).subscribe(candidates => {
      this.state.update(s => ({ ...s, candidates }));
    });
  }

  createCandidate(candidate: Candidate) {
    return this.http.post<Candidate>(this.candidateUrl, candidate).pipe(
      tap(candidate => this.state.update(s => ({ ...s, candidates: [...s.candidates, candidate] }))),
      map(() => true),
      catchError(() => of(false))
    );
  }

  updateCandidate(id: string, candidate: Partial<Candidate>): void {
    this.http.put<void>(`${this.candidateUrl}/${id}`, candidate).subscribe(() => {
      this.state.update(s => ({
        ...s,
        candidates: s.candidates.map(c => (c.id === id ? { ...c, ...candidate } : c)),
      }));
    });
  }

  deleteCandidate(id: string) {
    this.http.delete<void>(`${this.candidateUrl}/${id}`).subscribe(() => {
      this.state.update(s => ({
        ...s,
        candidates: s.candidates.filter(c => c.id !== id),
      }));
    });
  }

  setData<T extends keyof AppStateModel>(key: T, value: AppStateModel[T]) {
    this.state.set({
      ...this.state(),
      [key]: value,
    });
  }
}
