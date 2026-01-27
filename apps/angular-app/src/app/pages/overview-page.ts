import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, filter, map } from 'rxjs';
import { CandidateFormDialogComponent } from '../components/candidate-form-dialog';
import { AppState } from '../services/app-state';
import { CandidateStatusFilter } from '../services/data.model';

@Component({
  selector: 'app-overview-page',
  imports: [MatDialogModule, MatSnackBarModule, DatePipe],
  template: `
    <div class="mt-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex items-center gap-4 flex-wrap">
          <h2 class="text-lg leading-6 font-medium text-gray-900 flex items-center gap-2 whitespace-nowrap">
            Candidates:
            @if (candidatesResource.isLoading()) {
              <span class="animate-pulse h-4 w-8 bg-gray-200 rounded block"></span>
            } @else {
              {{ candidatesResource.value()?.length ?? 0 }}
            }
          </h2>

          <div class="relative group">
            <!-- search input -->
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                class="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by name..."
              [value]="currentParams().name"
              (input)="onSearch($any($event.target).value)"
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out" />
          </div>

          <!-- status Filter -->
          <div class="relative">
            <select
              [value]="currentParams().status"
              [disabled]="!!currentParams().name"
              (change)="onFilterChange('status', $any($event.target).value)"
              class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border disabled:bg-gray-100 disabled:text-gray-400">
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Rejected">Rejected</option>
              <option value="Hired">Hired</option>
            </select>
          </div>

          <!-- sort dropdown -->
          <div class="relative">
            <select
              [value]="currentParams().sort"
              [disabled]="!!currentParams().name"
              (change)="onFilterChange('sort', $any($event.target).value)"
              class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border disabled:bg-gray-100 disabled:text-gray-400">
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>

        <button
          (click)="onAddCandidate()"
          class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm whitespace-nowrap">
          Add Candidate
        </button>
      </div>

      <div class="mt-6">
        <ul role="list" class="grid gap-6">
          @if (candidatesResource.isLoading()) {
            @for (item of [1, 2, 3]; track item) {
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
                  </div>
                </div>
              </li>
            }
          } @else {
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
                        [class.bg-blue-100]="candidate.status === 'New'"
                        [class.text-blue-800]="candidate.status === 'New'"
                        [class.bg-yellow-100]="candidate.status === 'Interviewing'"
                        [class.text-yellow-800]="candidate.status === 'Interviewing'"
                        [class.bg-green-100]="candidate.status === 'Hired'"
                        [class.text-green-800]="candidate.status === 'Hired'"
                        [class.bg-red-100]="candidate.status === 'Rejected'"
                        [class.text-red-800]="candidate.status === 'Rejected'"
                        class="px-4 inline-flex text-sm leading-5 font-semibold rounded-full">
                        {{ candidate.status }}
                      </span>
                    </div>
                  </div>
                  <div class="mt-2 sm:flex sm:justify-between">
                    <div class="sm:flex">
                      <p class="flex items-center text-sm text-gray-500">{{ candidate.position }}</p>
                    </div>
                    <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <a
                        [href]="candidate.resumeUrl"
                        target="_blank"
                        class="text-indigo-600 hover:text-indigo-900 mr-4 font-medium flex items-center">
                        View Resume &rarr;
                      </a>
                      <div class="flex items-center text-xs text-gray-400 border-l border-gray-300 pl-4">
                        <span [title]="candidate.createdAt | date: 'full'">{{
                          candidate.createdAt | date: 'mediumDate'
                        }}</span>
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

  // updated Signal to track 'name' as well
  readonly currentParams = toSignal(
    this.route.queryParams.pipe(
      debounceTime(500),
      map(params => ({
        sort: (params['sort'] as 'latest' | 'oldest') || 'latest',
        status: (params['status'] || 'All') as CandidateStatusFilter,
        name: params['name'] || '',
      }))
    ),
    {
      initialValue: { sort: 'latest', status: 'All', name: '' },
    }
  );

  readonly candidatesResource = rxResource({
    params: () => this.currentParams(),
    stream: ({ params }) =>
      this.appState.getAllCandidates({
        status: params.status,
        order: params.sort,
        name: params.name,
      }),
  });

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
            this.candidatesResource.reload();
          }
        });
      });
  }

  // when searching, we clear status and sort
  onSearch(searchTerm: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        name: searchTerm || null,
        status: null, // clear filter
        sort: null, // clear sort
      },
      queryParamsHandling: 'merge',
    });
  }

  // when filtering, we clear the search name
  onFilterChange(key: 'status' | 'sort', value: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        [key]: value || null,
        name: null, // clear search
      },
      queryParamsHandling: 'merge',
    });
  }
}
