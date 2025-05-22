import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { Course } from '../../models/course.model';
import { CourseListComponent } from '../course-list/course-list.component';
import { CourseFormComponent } from '../course-form/course-form.component';
import { CourseService } from '../../services/course.service';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-courses-management',
  templateUrl: './courses-management.component.html',
  styleUrls: ['./courses-management.component.css'],
  standalone: true,
  imports: [MatDialogModule, CourseListComponent, CommonModule, CourseFormComponent, MatButtonModule]
})
export class CoursesManagementComponent implements OnInit, OnDestroy {
  courses: Course[] = [];
  selectedCourseId: number | null = null;
  selectedCourse: Course | null = null;
  loading = true;
  error: string | null = null;
  private destroy$ = new Subject<void>();
  isAddingNewCourse: boolean = false;

  constructor(
    private courseService: CourseService,
    public dialog: MatDialog
  ) {}

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
      .pipe(takeUntil(this.destroy$))
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

  onAddCourse(): void {
    this.isAddingNewCourse = true;
    this.selectedCourseId = null;
    this.selectedCourse = { id: 0, title: '', description: '', teacherId: 0 }; // אתחול כולל teacherId
  }

  onEditLessons(): void {
    if (this.selectedCourseId) {
      console.log(`עריכת שיעורים עבור קורס ID: ${this.selectedCourseId}`);
      // כאן תיפתח קומפוננטה או דיאלוג לניהול שיעורים
    }
  }

  onDeleteLessons(): void {
    if (this.selectedCourseId) {
      console.log(`מחיקת שיעורים עבור קורס ID: ${this.selectedCourseId}`);
      // כאן תהיה לוגיקה למחיקת שיעורים
    }
  }

  onEditCourse(courseId: number): void {
    this.selectedCourseId = courseId;
    this.selectedCourse = this.courses.find((c) => c.id === courseId) || null;
    this.isAddingNewCourse = false;
  }

  onDeleteCourse(event: { courseId: number; title: string }): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: { courseTitle: event.title },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
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
      .addCourse(courseData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadCourses();
          this.selectedCourseId = null;
          this.selectedCourse = { id: 0, title: '', description: '', teacherId: 0 }; // איפוס teacherId ל-0
          this.isAddingNewCourse = false;},
          error: (err) => {
            this.error = err.message || 'Failed to update course';
          },
        });
    } else {
      // הוספת קורס חדש
      this.courseService
        .addCourse(courseData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadCourses();
            this.selectedCourseId = null;
            this.selectedCourse = { id: 0, title: '', description: '', teacherId: 0 }; // איפוס לאחר הוספה
            this.isAddingNewCourse = false;
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
    this.isAddingNewCourse = false;
  }
}