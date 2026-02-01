import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SafeHtmlPipe } from '../pipes/safe-html.pipe';
import { AppState } from '../services/app-state';

@Component({
  selector: 'app-edit-profile-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    SafeHtmlPipe,
  ],
  template: `
    <h2 mat-dialog-title>Edit Profile</h2>

    <mat-dialog-content class="w-[500px]">
      <form class="flex flex-col gap-4 py-4">
        <mat-form-field appearance="outline">
          <mat-label>Full Name</mat-label>
          <input matInput [(ngModel)]="fullName" name="fullName" />
        </mat-form-field>

        <div
          class="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
          (dragover)="onDragOver($event)"
          (dragleave)="onDragLeave($event)"
          (drop)="onDrop($event)">
          <mat-icon class="text-gray-400 text-4xl w-10 h-10 mb-2">cloud_upload</mat-icon>
          <p class="text-sm text-gray-500">Drag & drop a new avatar here</p>
          <p class="text-xs text-gray-400 mt-1">Supports PNG, JPG, SVG</p>

          @if (fileName()) {
            <div class="mt-4 p-2 bg-indigo-50 text-indigo-700 text-sm rounded w-full text-center">
              <strong>Uploaded:</strong>
              <span [innerHTML]="fileName()"></span>
            </div>
          }
        </div>

        @if (avatarPreview()) {
          <div class="mt-2 text-center">
            <p class="text-sm font-medium text-gray-700 mb-2">Preview:</p>

            @if (isSvg()) {
              <div
                class="w-24 h-24 mx-auto border rounded-full overflow-hidden [&>svg]:w-full [&>svg]:h-full"
                [innerHTML]="avatarPreview() | safeHtml"></div>
            } @else {
              <img
                [src]="avatarPreview()"
                alt="Image Preview"
                class="w-24 h-24 mx-auto rounded-full object-cover border" />
            }
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

  readonly fullName = this.appState.currentUser()?.fullName || '';

  // Upload State
  readonly fileName = signal<string>('');
  readonly avatarPreview = signal<string>('');
  readonly isSvg = signal<boolean>(false);

  // Drag & Drop Handlers
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

  handleFile(file: File) {
    // 1. Set Filename (Vulnerable to XSS if filename contains HTML)
    this.fileName.set(file.name);

    // 2. Read File Content
    const reader = new FileReader();

    if (file.type === 'image/svg+xml') {
      this.isSvg.set(true);
      // For SVG, we read as TEXT to inline it (Vulnerable behavior)
      reader.onload = (e: any) => {
        this.avatarPreview.set(e.target.result);
      };
      reader.readAsText(file);
    } else {
      this.isSvg.set(false);
      // For images, we read as DataURL
      reader.onload = (e: any) => {
        this.avatarPreview.set(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  save() {
    this.dialogRef.close({
      fullName: this.fullName,
      avatar: this.avatarPreview() || this.appState.currentUser()?.avatar,
    });
  }

  close() {
    this.dialogRef.close();
  }
}
