import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';
import { CourseListComponent } from '../course-list/course-list.component';
import { CommonModule } from '@angular/common';
import { CourseFormComponent } from '../course-form/course-form.component';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialogContent } from '@angular/material/dialog';
import { MatDialogActions } from '@angular/material/dialog';
// קומפוננטת דיאלוג לאישור מחיקה
@Component({
  selector: 'delete-confirmation-dialog',
  templateUrl: './delete-confirmation-dialog.component.html',
  styleUrl: './delete-confirmation-dialog.component.css',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatDialogContent, MatDialogActions],})
export class DeleteConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { courseTitle: string }
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
