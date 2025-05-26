// src/app/components/course-form/course-form.component.ts

import { Component, Input, Output, EventEmitter, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Course } from '../../models/course.model';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.css']
})
export class CourseFormComponent implements OnInit {
  courseForm!: FormGroup;

  @Input() course: Course | null = null;
  @Output() formSubmit = new EventEmitter<Course>();
  @Output() formCancel = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    @Optional() public dialogRef?: MatDialogRef<CourseFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: { course: Course }
  ) {}

  ngOnInit(): void {
    const initialCourse = this.data?.course || this.course || { id: 0, title: '', description: '', teacherId: 0 };

    this.courseForm = this.fb.group({
      id: [initialCourse.id],
      title: [initialCourse.title, Validators.required],
      description: [initialCourse.description, Validators.required],
      teacherId: [initialCourse.teacherId, [Validators.required, Validators.min(1)]]
    });
  }

  // **** ADD THIS METHOD ****
  isDialogMode(): boolean {
    return !!this.dialogRef; // Returns true if dialogRef exists (meaning it was injected)
  }
  // ************************

  onSubmit(): void {
    if (this.courseForm.valid) {
      if (this.isDialogMode()) {
        this.dialogRef!.close(this.courseForm.value);
      } else {
        this.formSubmit.emit(this.courseForm.value);
      }
    }
  }

  onCancel(): void {
    if (this.isDialogMode()) {
      this.dialogRef!.close();
    } else {
      this.formCancel.emit();
    }
  }
}