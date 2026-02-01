import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // Import
import { Router } from '@angular/router';

import { AppState } from '../services/app-state';
import { EditProfileDialogComponent } from './edit-profile-dialog';

@Component({
  selector: 'app-header',
  imports: [MatDialogModule], // Add MatDialogModule
  template: `
    @if (currentUser(); as currentUser) {
      <nav class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <span class="text-2xl font-bold text-indigo-600">HR Clone</span>
            </div>

            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-700">Hello, {{ currentUser.fullName }}</span>
                <button
                  (click)="openEditProfile()"
                  class=" bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded transition-colors">
                  Edit Profile
                </button>
              </div>

              <div class="text-gray-400">|</div>

              <button (click)="logout()" class="text-gray-500 hover:text-gray-700 font-medium">Logout</button>
            </div>
          </div>
        </div>
      </nav>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly appState = inject(AppState);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog); // Inject Dialog

  readonly currentUser = computed(() => this.appState.publicState().user);

  openEditProfile() {
    const dialogRef = this.dialog.open(EditProfileDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Profile updated:', result);
        // Update local state with new name/avatar
        //this.appState.updateUser(result);
      }
    });
  }

  logout() {
    this.router.navigate(['/login']);
    localStorage.removeItem('access_token');
    this.appState.setData('token', null);
    this.appState.setData('user', null);
  }
}
