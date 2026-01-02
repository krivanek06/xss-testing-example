import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
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

  loadCandidates() {
    this.http.get<Candidate[]>('/api/candidates').subscribe(candidates => {
      this.state.update(s => ({ ...s, candidates }));
    });
  }

  setData<T extends keyof AppStateModel>(key: T, value: AppStateModel[T]) {
    this.state.set({
      ...this.state(),
      [key]: value,
    });
  }
}
