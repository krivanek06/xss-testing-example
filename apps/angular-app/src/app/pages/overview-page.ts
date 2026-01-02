import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AppState } from '../services/app-state';

@Component({
  selector: 'app-overview-page',
  imports: [],
  template: `
    <div class="min-h-screen bg-gray-100 font-sans text-gray-900">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div class="space-y-6 fade-in">
          <div class="bg-white shadow overflow-hidden sm:rounded-lg p-6 border-l-4 border-green-500">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Welcome back, {{ currentUser().fullName }}!</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">
              Role:
              <span class="uppercase font-bold tracking-wide text-xs bg-gray-100 p-1 rounded">{{
                currentUser().role
              }}</span>
            </p>
          </div>

          <div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div class="bg-white overflow-hidden shadow rounded-lg px-4 py-5 sm:p-6 hover:shadow-md transition-shadow">
              <dt class="text-sm font-medium text-gray-500 truncate">Pending Candidates</dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900">12</dd>
            </div>
            <div class="bg-white overflow-hidden shadow rounded-lg px-4 py-5 sm:p-6 hover:shadow-md transition-shadow">
              <dt class="text-sm font-medium text-gray-500 truncate">Open Positions</dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900">3</dd>
            </div>
            <div class="bg-white overflow-hidden shadow rounded-lg px-4 py-5 sm:p-6 hover:shadow-md transition-shadow">
              <dt class="text-sm font-medium text-gray-500 truncate">Upcoming Interviews</dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900">5</dd>
            </div>
          </div>
        </div>
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

  readonly currentUser = this.appState.currentUser;
}
