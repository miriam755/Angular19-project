import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Course } from '../models/course.model'; // מודל הקורס (ודא שהנתיב נכון)
import { CommonModule } from '@angular/common';
import { CourseListComponent } from '../course-list/course-list.component';
import { CourseFormComponent}from '../course-form/course-form.component'
import { Subject, takeUntil } from 'rxjs';
import { CourseService } from '../services/course.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
@Component({
  selector: 'app-courses-management', // שנה את הסלקטור בהתאם
  templateUrl: './courses-management.component.html',
  styleUrls: ['./courses-management.component.css'], // צור קובץ CSS אם אתה צריך
  standalone: true,
  imports: [MatDialogModule, CourseListComponent, CommonModule, CourseFormComponent], // ייבא את הקומפוננטה שיצרנו
})
export class CoursesManagementComponent implements OnInit, OnDestroy {
  courses: Course[] = [];
  selectedCourseId: number | null = null;
  selectedCourse: Course | null = null;
  loading = true;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(private courseService: CourseService, public dialog: MatDialog) {} //הזרקת MatDialog

  ngOnInit(): void {
    this.loadCourses();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCourses(): void {
    this.loading = true;
    this.error = null;
    this.courseService
      .getAllCourses()
      .pipe(takeUntil(this.destroy$)) // הסר מנוי בעת השמדה
      .subscribe({
        next: (courses) => {
          this.courses = courses;
          this.loading = false;
        },
        error: (err) => {
          this.error = err.message || 'Failed to load courses';
          this.loading = false;
        },
      });
  }

  onEditCourse(courseId: number): void {
    this.selectedCourseId = courseId;
    this.selectedCourse = this.courses.find((c) => c.id === courseId) || null; // Find the course to edit
  }

  onDeleteCourse(event:{courseId: number, title: string}): void {
    // פתח את הדיאלוג
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: { courseTitle: event.title }, // העבר את שם הקורס לדיאלוג
    });

    // הירשם לתוצאת הדיאלוג
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // אם המשתמש אישר, מחק את הקורס
        this.courseService
          .deleteCourse(event.courseId)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.loadCourses();
              this.selectedCourseId = null;
              this.selectedCourse = null;
            },
            error: (err) => {
              this.error = err.message || 'Failed to delete course';
            },
          });
      }
    });
  }

  onFormSubmit(courseData: Course): void {
    if (courseData.id) {
      // עדכון קורס קיים
      this.courseService
        .updateCourse(courseData.id, courseData)
        .pipe(takeUntil(this.destroy$)) // הסר מנוי בעת השמדה
        .subscribe({
          next: () => {
            this.loadCourses(); // רענן את הרשימה
            this.selectedCourseId = null; // נקה לאחר השמירה
            this.selectedCourse = null;
          },
          error: (err) => {
            this.error = err.message || 'Failed to update course';
          },
        });
    } else {
      // הוספת קורס חדש
      this.courseService
        .addCourse(courseData)
        .pipe(takeUntil(this.destroy$)) // הסר מנוי בעת השמדה
        .subscribe({
          next: () => {
            this.loadCourses(); // רענן את הרשימה
            this.selectedCourseId = null; // נקה לאחר השמירה
            this.selectedCourse = null;
          },
          error: (err) => {
            this.error = err.message || 'Failed to add course';
          },
        });
    }
  }

  onFormCancel(): void {
    this.selectedCourseId = null;
    this.selectedCourse = null;
  }
}

