import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { CandidateFormDialogComponent } from '../components/candidate-form-dialog';
import { AppState } from '../services/app-state';
import { CandidateStatusFilter } from '../services/data.model';

@Component({
  selector: 'app-overview-page',
  imports: [MatDialogModule, MatSnackBarModule, DatePipe],
  template: `
    <div class="mt-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex items-center gap-4">
          <h2 class="text-lg leading-6 font-medium text-gray-900 flex items-center gap-2">
            Candidates:
            @if (candidatesResource.isLoading()) {
              <span class="animate-pulse h-4 w-8 bg-gray-200 rounded block"></span>
            } @else {
              {{ candidatesResource.value()?.length ?? 0 }}
            }
          </h2>

          <!-- Status Filter Dropdown -->
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

          <!-- Sort Order Dropdown -->
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
          <!-- loading state -->
          @if (candidatesResource.isLoading()) {
            @for (item of [1, 2, 3, 4, 5, 6]; track item) {
              <li class="bg-white rounded-md shadow-md p-6 animate-pulse">
                <div class="flex justify-between items-center mb-4">
                  <div class="space-y-2 w-1/3">
                    <div class="h-4 bg-gray-200 rounded"></div>
                    <div class="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  <div class="h-6 w-20 bg-gray-200 rounded-full"></div>
                </div>

                <div class="border-t border-gray-100 pt-3">
                  <div class="h-3 bg-gray-200 rounded w-32 mb-2"></div>
                  <div class="space-y-2">
                    <div class="h-3 bg-gray-200 rounded"></div>
                    <div class="h-3 bg-gray-200 rounded"></div>
                    <div class="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </li>
            }
          } @else {
            <!-- loaded state -->
            @for (candidate of candidatesResource.value(); track candidate.id) {
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
                      <a
                        [href]="candidate.resumeUrl"
                        target="_blank"
                        class="text-indigo-600 hover:text-indigo-900 mr-4 font-medium flex items-center">
                        View Resume &rarr;
                      </a>

                      <div class="flex items-center text-xs text-gray-400 border-l border-gray-300 pl-4">
                        <svg class="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span [title]="candidate.createdAt | date: 'full'">
                          {{ candidate.createdAt | date: 'mediumDate' }}
                        </span>
                      </div>
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

  readonly currentSort = toSignal(
    this.route.queryParams.pipe(
      map(params => ({
        sort: (params['sort'] as 'latest' | 'oldest') || 'latest',
        status: (params['status'] || 'All') as CandidateStatusFilter,
      }))
    ),
    {
      initialValue: { sort: 'latest', status: 'All' },
    }
  );

  readonly candidatesResource = rxResource({
    params: () => ({ sort: this.currentSort() }),
    stream: ({ params }) =>
      this.appState.getAllCandidates({
        status: params.sort.status,
        order: params.sort.sort,
      }),
  });

  constructor() {
    effect(() => console.log(this.candidatesResource.value()));
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
            // Optional: Reload data to show new candidate
            this.candidatesResource.reload();
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
