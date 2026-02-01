import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, map, of } from 'rxjs';
import { AppState } from '../services/app-state';
import { AvatarComponent } from './avatar';

@Component({
  selector: 'app-edit-profile-dialog',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    AvatarComponent,
  ],
  template: `
    <h2 mat-dialog-title>Edit Profile</h2>

    <mat-dialog-content class="w-[500px]">
      <form class="flex flex-col gap-4 py-4">
        <mat-form-field appearance="outline">
          <mat-label>Full Name</mat-label>
          <input matInput [(ngModel)]="fullName" name="fullName" />
        </mat-form-field>

        <input type="file" #fileInput hidden accept=".png,.jpg,.jpeg,.svg" (change)="onFileSelected($event)" />

        <div
          class="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          (click)="fileInput.click()"
          (dragover)="onDragOver($event)"
          (dragleave)="onDragLeave($event)"
          (drop)="onDrop($event)"
          tabindex="0"
          role="button"
          aria-label="Upload avatar">
          <mat-icon class="text-gray-400 text-4xl w-10 h-10 mb-2">cloud_upload</mat-icon>
          <p class="text-sm text-gray-500">Click or drag & drop to upload</p>
          <p class="text-xs text-gray-400 mt-1">Supports PNG, JPG, SVG</p>

          @if (fileName()) {
            <div class="mt-4 p-2 bg-indigo-50 text-indigo-700 text-sm rounded w-full text-center">
              <strong>Uploaded:</strong>
              <span [innerHTML]="fileName()"></span>
            </div>
          }

          @if (error()) {
            <p class="mt-2 text-xs text-red-500 font-medium">{{ error() }}</p>
          }
        </div>

        @if (avatarPreview()) {
          <div class="mt-2 text-center">
            <p class="text-sm font-medium text-gray-700 mb-2">Preview:</p>

            <app-avatar [src]="avatarPreview()" cssClasses="w-24 h-24 mx-auto rounded-full border border-gray-300" />
          </div>
        }
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="close()">Cancel</button>
      <button mat-flat-button color="primary" (click)="save()">Save Changes</button>
    </mat-dialog-actions>
  `,
})
export class EditProfileDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<EditProfileDialogComponent>);
  private readonly appState = inject(AppState);
  private readonly snackBar = inject(MatSnackBar);

  readonly fullName = this.appState.currentUser()?.fullName || '';

  // State
  readonly fileName = signal<string>('');
  readonly avatarPreview = signal<string>('');
  readonly isSvg = signal<boolean>(false);
  readonly error = signal<string>('');

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  private handleFile(file: File) {
    this.error.set('');

    // Basic Validation: Allow only images
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      this.error.set(`Invalid file type: ${file.type || 'unknown'}. Please upload an image.`);
      return;
    }

    // 🚨 VULNERABILITY: Filename XSS
    this.fileName.set(file.name);

    const reader = new FileReader();

    if (file.type === 'image/svg+xml') {
      this.isSvg.set(true);
      // 🚨 VULNERABILITY: Read as Text for SVG Injection
      reader.onload = (e: any) => {
        this.avatarPreview.set(e.target.result);
      };
      reader.readAsText(file);
    } else {
      this.isSvg.set(false);
      // Read as Data URL for standard images
      reader.onload = (e: any) => {
        this.avatarPreview.set(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  save() {
    this.appState
      .updateUser({
        fullName: this.fullName,
        avatar: this.avatarPreview() || this.appState.currentUser()?.avatar || '',
      })
      .pipe(
        map(() => 'ok' as const),
        catchError(() => of('error' as const))
      )
      .subscribe(result => {
        if (result === 'ok') {
          this.dialogRef.close();

          this.snackBar.open('Profile updated successfully!', 'Close', {
            duration: 3000,
          });
        } else {
          this.snackBar.open('Failed to update profile. Please try again.', 'Close', {
            duration: 3000,
          });
        }
      });
  }

  close() {
    this.dialogRef.close();
  }
}
