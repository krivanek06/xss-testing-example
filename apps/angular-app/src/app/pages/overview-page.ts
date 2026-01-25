import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs';
import { CandidateFormDialogComponent } from '../components/candidate-form-dialog';
import { AppState } from '../services/app-state';
import { CandidateStatus } from '../services/data.model';

@Component({
  selector: 'app-overview-page',
  imports: [MatDialogModule, MatSnackBarModule],
  template: `
    <div class="mt-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex items-center gap-4">
          <h2 class="text-lg leading-6 font-medium text-gray-900">Candidates: {{ candidates().length }}</h2>

          <div class="relative">
            <select
              [value]="currentSort().status"
              (change)="updateQueryParams('status', $any($event.target).value)"
              class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border">
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Rejected">Rejected</option>
              <option value="Hired">Hired</option>
            </select>
          </div>

          <div class="relative">
            <select
              [value]="currentSort().sort"
              (change)="updateQueryParams('sort', $any($event.target).value)"
              class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border">
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>

        <button
          (click)="onAddCandidate()"
          class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
          Add Candidate
        </button>
      </div>

      <div class="mt-6">
        <ul role="list" class="grid gap-6">
          @for (candidate of candidates(); track candidate.id) {
            <li class="hover:bg-gray-100 transition-colors duration-150 ease-in-out bg-gray-50 rounded-md shadow-md">
              <div class="px-4 py-4 sm:px-6">
                <div class="flex items-center justify-between">
                  <div class="truncate text-sm font-medium text-indigo-600">
                    {{ candidate.name }}
                    <span class="ml-2 text-gray-500 font-normal text-xs">({{ candidate.email }})</span>
                  </div>
                  <div class="ml-2 flex-shrink-0 flex">
                    <span
                      class="px-4 inline-flex text-sm leading-5 font-semibold rounded-full"
                      [class.bg-green-100]="candidate.status === 'Hired'"
                      [class.text-green-800]="candidate.status === 'Hired'"
                      [class.bg-yellow-100]="candidate.status === 'Interviewing'"
                      [class.text-yellow-800]="candidate.status === 'Interviewing'"
                      [class.bg-red-100]="candidate.status === 'Rejected'"
                      [class.text-red-800]="candidate.status === 'Rejected'"
                      [class.bg-blue-100]="candidate.status === 'New'"
                      [class.text-blue-800]="candidate.status === 'New'">
                      {{ candidate.status }}
                    </span>
                  </div>
                </div>

                <div class="mt-2 sm:flex sm:justify-between">
                  <div class="sm:flex">
                    <p class="flex items-center text-sm text-gray-500">
                      <svg
                        class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {{ candidate.position }}
                    </p>
                  </div>

                  <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <a [href]="candidate.resumeUrl" target="_blank" class="text-indigo-600 hover:text-indigo-900 mr-4">
                      View Resume &rarr;
                    </a>
                  </div>
                </div>

                <div class="mt-3 text-sm text-gray-500 border-t border-gray-400 pt-3">
                  <span class="font-medium text-gray-900 block mb-1">Cover Letter Snippet:</span>
                  <div
                    class="prose prose-sm max-w-none text-gray-500 p-2 rounded"
                    [innerHTML]="candidate.coverLetter"></div>
                </div>
              </div>
            </li>
          }
        </ul>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewPage {
  private readonly appState = inject(AppState);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly currentUser = this.appState.currentUser;
  readonly candidates = computed(() => this.appState.publicState().candidates);

  readonly currentSort = signal<{
    sort: 'latest' | 'oldest';
    status: CandidateStatus;
  }>({
    sort: (this.route.snapshot.queryParamMap.get('sort') as 'latest' | 'oldest') || 'latest',
    status: (this.route.snapshot.queryParamMap.get('status') as CandidateStatus) || 'All',
  });

  constructor() {
    this.appState.getAllCandidates();

    effect(() => {
      console.log('Candidates updated:', this.appState.publicState().candidates);
      console.log('currentSort', this.currentSort());
    });
  }

  onFilterChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const status = selectElement.value;
    // 2. Update filter signal
    console.log('Filtering candidates by status:', status);

    // Optional: If you want server-side filtering instead:
    // this.candidatesService.getAllCandidates({ status: status as CandidateStatus }).subscribe(...)
  }

  onAddCandidate() {
    const dialogRef = this.dialog.open(CandidateFormDialogComponent, {
      width: '700px',
    });

    dialogRef
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(result => {
        this.appState.createCandidate(result).subscribe(result => {
          if (result) {
            this.snackBar.open('Candidate added successfully!', undefined, {
              duration: 1500,
              horizontalPosition: 'end',
              verticalPosition: 'top',
            });
          }
        });
      });
  }

  updateQueryParams(key: 'status' | 'sort', value: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { [key]: value || null },
      queryParamsHandling: 'merge',
    });
  }
}
