import { DatePipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input, linkedSignal, model, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { FormField, disabled, form, required } from '@angular/forms/signals';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { AppState } from '../services/app-state';
import { Candidate } from '../services/data.model';
@Component({
  selector: 'app-candidate-detail-page',
  standalone: true,
  imports: [FormField, FormsModule, DatePipe, MatSnackBarModule, NgClass, RouterLink],
  template: `
    <div class=" min-h-screen">
      <div class="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        @if (candidate.value()) {
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-6 border-b border-gray-200 flex justify-between items-center">
              <h1 class="text-3xl font-bold text-gray-800">Candidate Details</h1>
              <div class="flex items-center space-x-2">
                <button
                  routerLink="/"
                  class="px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm whitespace-nowrap bg-gray-200 hover:bg-gray-300 text-gray-800">
                  Go Back
                </button>
                <button
                  (click)="toggleEditMode()"
                  class="px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm whitespace-nowrap"
                  [ngClass]="{
                    'bg-indigo-600 hover:bg-indigo-700 text-white': !isEditMode(),
                    'bg-gray-200 hover:bg-gray-300 text-gray-800': isEditMode(),
                  }">
                  {{ isEditMode() ? 'Cancel' : 'Edit' }}
                </button>
              </div>
            </div>

            <div class="p-6">
              <form class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    [formField]="candidateForm.name"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-200 disabled:text-gray-700 disabled:border-gray-300 disabled:cursor-not-allowed disabled:opacity-75" />
                </div>
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    [formField]="candidateForm.email"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-200 disabled:text-gray-700 disabled:border-gray-300 disabled:cursor-not-allowed disabled:opacity-75" />
                </div>
                <div>
                  <label for="position" class="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  <input
                    type="text"
                    [formField]="candidateForm.position"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-200 disabled:text-gray-700 disabled:border-gray-300 disabled:cursor-not-allowed disabled:opacity-75" />
                </div>
                <div>
                  <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    [formField]="candidateForm.status"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-200 disabled:text-gray-700 disabled:border-gray-300 disabled:cursor-not-allowed disabled:opacity-75">
                    <option>New</option>
                    <option>Interviewing</option>
                    <option>Hired</option>
                    <option>Rejected</option>
                  </select>
                </div>
                <div class="md:col-span-2">
                  <label for="coverLetter" class="block text-sm font-medium text-gray-700 mb-1">Cover Letter</label>
                  <textarea
                    [formField]="candidateForm.coverLetter"
                    rows="6"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-200 disabled:text-gray-700 disabled:border-gray-300 disabled:cursor-not-allowed disabled:opacity-75"></textarea>
                </div>
              </form>
              @if (isEditMode()) {
                <div class="mt-8 flex justify-end">
                  <button
                    (click)="saveChanges()"
                    class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors shadow-lg">
                    Save Changes
                  </button>
                </div>
              }
            </div>
          </div>

          <div class="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-2xl font-bold text-gray-800">Comments</h2>
            </div>

            <!-- Existing Comments -->
            <div class="p-6 space-y-4">
              @for (comment of candidate.value()?.comments; track comment.id) {
                <div
                  class="flex items-start space-x-4 p-4 rounded-lg group relative"
                  [class.bg-gray-200]="comment.userId !== currentUser().id"
                  [class.bg-indigo-50]="comment.userId === currentUser().id">
                  <img
                    class="w-10 h-10 rounded-full"
                    [src]="'https://i.pravatar.cc/150?u=' + comment.userId"
                    alt="User avatar" />

                  <div class="flex-1">
                    <div class="flex items-center justify-between">
                      <p class="font-bold">{{ comment.username }}</p>

                      <div class="flex items-center gap-2">
                        <span class="text-xs text-gray-500">{{ comment.timestamp | date: 'short' }}</span>

                        @if (comment.userId === currentUser().id) {
                          <button
                            (click)="deleteComment(comment.id)"
                            type="button"
                            class="p-1.5 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-100 "
                            title="Delete comment">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="currentColor"
                              class="w-5 h-5">
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                          </button>
                        }
                      </div>
                    </div>
                    <p class="text-gray-700 mt-1">{{ comment.comment }}</p>
                  </div>
                </div>
              } @empty {
                <p class="text-gray-500">No comments yet.</p>
              }
            </div>

            <div class="p-6 border-t border-gray-200">
              <div class="mt-4">
                <label for="comment" class="block text-sm font-medium text-gray-700 mb-1">Add a new comment</label>
                <textarea
                  [(ngModel)]="newComment"
                  placeholder="Write a comment..."
                  rows="4"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
                <button
                  (click)="submitComment()"
                  class="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
                  Submit Comment
                </button>
              </div>
            </div>
          </div>
        } @else {
          <div class="flex justify-center items-center p-8">
            <p class="text-gray-500">Loading candidate...</p>
          </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandidateDetailPage {
  private readonly appState = inject(AppState);
  private readonly snackBar = inject(MatSnackBar);

  readonly currentUser = this.appState.currentUser;

  /** candidate ID */
  readonly id = input.required<string>();

  readonly candidate = rxResource({
    params: () => ({ id: this.id() }),
    stream: ({ params }) => this.appState.getCandidateById(params.id),
  });

  readonly candidateSignal = linkedSignal({
    source: this.candidate.value,
    computation: candidate => {
      const candidateForm = candidate
        ? { ...candidate }
        : ({
            id: '',
            name: '',
            email: '',
            status: 'New',
            position: '',
            coverLetter: '',
            resumeUrl: '',
            createdAt: '',
          } satisfies Omit<Candidate, 'comments'>);

      return candidateForm;
    },
  });

  readonly candidateForm = form(this.candidateSignal, schema => {
    required(schema.name);
    required(schema.email);
    required(schema.position);
    required(schema.coverLetter);
    disabled(schema.name, () => !this.isEditMode());
    disabled(schema.email, () => !this.isEditMode());
    disabled(schema.position, () => !this.isEditMode());
    disabled(schema.status, () => !this.isEditMode());
    disabled(schema.coverLetter, () => !this.isEditMode());
  });

  readonly isEditMode = signal(false);
  readonly newComment = model<string>('');

  constructor() {
    effect(() => console.log('candidateForm', this.candidateForm().value()));

    effect(() => {
      console.log('newComment', this.newComment());
    });
  }

  toggleEditMode() {
    this.isEditMode.update(value => !value);
  }

  saveChanges() {
    if (!this.candidateForm().valid()) {
      this.snackBar.open('Please fill in all required fields.', 'Close', {
        duration: 3000,
      });
      return;
    }

    console.log('this', this.candidateForm().value());
    // this.appState.updateCandidate(candidate.id, this.candidateForm.).subscribe(() => {
    //   this.isEditMode.set(false);
    // });
  }

  submitComment() {
    const user = this.appState.currentUser();
    const candidate = this.candidate.value();

    // TODO - make comments more JSON - allow upload gifs, svg, image, format text
    // TODO - send JSON to server, do not validate it, display in HTML with innerHTML + safeHtml pipe
    // TODO - steal the endpoint and make a POST request in postman and insert XSS payload directly
    const comment = this.newComment()?.trim();

    // not logged in
    if (!user || !candidate) {
      this.snackBar.open('You must be logged in to submit a comment.', 'Close', {
        duration: 3000,
      });
      return;
    }

    // empty comment
    if (!comment) {
      this.snackBar.open('Comment cannot be empty.', 'Close', {
        duration: 3000,
      });
      return;
    }

    // submit comment
    this.appState
      .addComment(candidate.id, {
        comment: comment,
        timestamp: new Date().toISOString(),
        username: user.username,
        userId: user.id,
      })
      .subscribe(() => {
        this.newComment.set('');
        this.snackBar.open('Comment submitted successfully!', 'Close', {
          duration: 3000,
        });

        // reload candidate to get updated comments
        this.candidate.reload();
      });
  }

  deleteComment(commentId: string) {
    const candidateId = this.candidate.value()?.id;
    if (!candidateId) {
      return;
    }

    this.appState.deleteComment(candidateId, commentId).subscribe({
      next: () => {
        this.snackBar.open('Comment deleted', 'Close', { duration: 2000 });
        // Reload the resource to refresh the comment list
        this.candidate.reload();
      },
      error: err => {
        console.error(err);
        this.snackBar.open('Failed to delete comment', 'Close', { duration: 3000 });
      },
    });
  }
}
