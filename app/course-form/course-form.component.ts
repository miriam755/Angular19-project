import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Course } from '../models/course.model'; // הנח שיש לך מודל Course
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,
  MatFormFieldModule,MatInputModule,MatButtonModule],
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.css']
})
export class CourseFormComponent implements OnInit {
  @Input() course: Course | null = null; // קורס לעריכה (null עבור הוספה)
  @Output() formSubmit = new EventEmitter<Course>(); // פולט את נתוני הטופס
  @Output() formCancel = new EventEmitter<void>();
  courseForm: FormGroup; // הכרזה על ה-FormGroup

  constructor(private fb: FormBuilder) {
    this.courseForm = this.fb.group({
      title: [this.course?.title || '', [Validators.required, Validators.maxLength(255)]],
      description: [this.course?.description || '', Validators.required],
      teacherId: [this.course?.teacherId || '', [Validators.required, Validators.pattern(/^[0-9]+$/)]] // example validation
    });
  }


  ngOnInit(): void {
    this.courseForm = this.fb.group({
      title: [this.course?.title || '', [Validators.required, Validators.maxLength(255)]],
      description: [this.course?.description || '', Validators.required],
      teacherId: [this.course?.teacherId || '', [Validators.required, Validators.pattern(/^[0-9]+$/)]] // example validation
    });
  }

  onSubmit(): void {
    if (this.courseForm.valid) {
      const formData: Course = {
        id: this.course?.id || 0, // 0 הוא מזהה ברירת מחדל לקורסים חדשים
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

