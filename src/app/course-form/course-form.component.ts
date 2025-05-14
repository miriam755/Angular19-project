import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Course } from '../models/course.model';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card'; // ייבוא MatCardModule

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule],
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.css']
})
export class CourseFormComponent implements OnInit {
  @Input() course: Course | null = null;
  @Output() formSubmit = new EventEmitter<Course>();
  @Output() formCancel = new EventEmitter<void>();
  courseForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.courseForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', Validators.required],
      teacherId: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]] // דוגמת ולידציה
    });
  }

  ngOnInit(): void {
    this.courseForm.patchValue({
      title: this.course?.title || '',
      description: this.course?.description || '',
      teacherId: this.course?.teacherId || ''
    });
  }

  onSubmit(): void {
    if (this.courseForm.valid) {
      const formData: Course = {
        id: this.course?.id || 0,
        title: this.courseForm.value.title,
        description: this.courseForm.value.description,
        teacherId: this.courseForm.value.teacherId
      };
      this.formSubmit.emit(formData);
    }
  }

  onCancel(): void {
    this.formCancel.emit();
  }

  get titleControl() { return this.courseForm.get('title'); }
  get descriptionControl() { return this.courseForm.get('description'); }
  get teacherIdControl() { return this.courseForm.get('teacherId'); }
}