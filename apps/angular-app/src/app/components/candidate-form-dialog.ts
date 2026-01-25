import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CandidateStatus } from '../services/data.model';

@Component({
  selector: 'app-candidate-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  template: `
    <h2 mat-dialog-title>Add New Candidate</h2>

    <mat-dialog-content>
      <form [formGroup]="form" class="flex flex-col gap-4 pt-2">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Full Name</mat-label>
          <input matInput formControlName="name" placeholder="John Doe" />
          @if (form.get('name')?.hasError('required')) {
            <mat-error>Name is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" type="email" placeholder="john@example.com" />
          @if (form.get('email')?.hasError('required')) {
            <mat-error>Email is required</mat-error>
          }
          @if (form.get('email')?.hasError('email')) {
            <mat-error>Invalid email format</mat-error>
          }
        </mat-form-field>

        <div class="flex gap-4">
          <mat-form-field appearance="outline" class="flex-1">
            <mat-label>Position</mat-label>
            <input matInput formControlName="position" placeholder="Senior Developer" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="flex-1">
            <mat-label>Status</mat-label>
            <mat-select formControlName="status">
              <mat-option value="New">New</mat-option>
              <mat-option value="Interviewing">Interviewing</mat-option>
              <mat-option value="Hired">Hired</mat-option>
              <mat-option value="Rejected">Rejected</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Resume URL</mat-label>
          <input matInput formControlName="resumeUrl" placeholder="https://linkedin.com/in/..." />
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Cover Letter (HTML Allowed)</mat-label>
          <textarea matInput formControlName="coverLetter" rows="4" placeholder="I am very interested..."></textarea>
          <mat-hint>HTML tags are accepted here.</mat-hint>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid" (click)="onSubmit()">Create Candidate</button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      mat-form-field {
        width: 100%;
      }
    `,
  ],
})
export class CandidateFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<CandidateFormDialogComponent>);

  readonly form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    position: ['', Validators.required],
    status: ['New' satisfies CandidateStatus, Validators.required],
    resumeUrl: [''],
    coverLetter: [''], // No validators here to allow free text/html for the exploit
    comments: [[]],
  });

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.valid) {
      // Pass the form value back to the parent component
      this.dialogRef.close(this.form.value);
    }
  }
}
