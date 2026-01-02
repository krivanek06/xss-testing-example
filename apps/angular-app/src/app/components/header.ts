import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '../services/app-state';

@Component({
  selector: 'app-header',
  imports: [],
  template: `
    @if (currentUser(); as currentUser) {
      <nav class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <span class="text-2xl font-bold text-indigo-600">Workday Clone</span>
            </div>
            <div class="flex items-center">
              <button (click)="logout()" class="text-gray-500 hover:text-gray-700 font-medium">Logout</button>
            </div>
          </div>
        </div>
      </nav>
    }
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly appState = inject(AppState);
  private readonly router = inject(Router);
  readonly currentUser = computed(() => this.appState.publicState().user);

  logout() {
    this.router.navigate(['/login']);

    localStorage.removeItem('access_token');
    this.appState.setData('token', null);
    this.appState.setData('user', null);
  }
}
