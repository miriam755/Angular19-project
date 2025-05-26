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
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'app-courses-management',
  templateUrl: './courses-management.component.html',
  styleUrls: ['./courses-management.component.css'],
  standalone: true,
  imports: [MatCardModule,MatDialogModule,MatIconModule, CourseListComponent, CommonModule, CourseFormComponent, MatButtonModule]
})
export class CoursesManagementComponent implements OnInit, OnDestroy {
  courses: Course[] = [];
  selectedCourseId: number | null = null;
  selectedCourse: Course | null = null;
  loading = true;
  error: string | null = null;
  private destroy$ = new Subject<void>();
  isAddingNewCourse: boolean = false; // מצב האם אנו במצב הוספת קורס חדש

  constructor(
    private courseService: CourseService,
    public dialog: MatDialog,
    private router:Router
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

 

  // פונקציה לעריכת שיעורים (כרגע רק הדפסה לקונסול, תצטרכי לממש ניתוב/דיאלוג לכך)
  onEditLessons(courseId: number): void { // שינוי: קבלת courseId ישירות
    console.log(`עריכת שיעורים עבור קורס ID: ${courseId}`);
    
     this.router.navigate(['/manage-lessons', courseId]);
    // או לפתוח דיאלוג לניהול שיעורים
  }

  // פונקציה שנשלחת מה-CourseListComponent בלחיצה על "ערוך"
  onEditCourse(courseId: number): void {
    this.isAddingNewCourse = false; // וודא שחלונית ההוספה ב-inline סגורה
    const courseToEdit = this.courses.find((c) => c.id === courseId);

    if (courseToEdit) {
      const dialogRef = this.dialog.open(CourseFormComponent, {
        width: '500px', // גודל הדיאלוג
        // העבר את אובייקט הקורס לטופס דרך אובייקט ה-data של הדיאלוג
        data: { course: { ...courseToEdit } } // שימוש ב-spread operator ליצירת עותק נקי
      });

      dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(result => {
        // ה-result יהיה אובייקט ה-Course המעודכן אם המשתמש לחץ 'שמור', או undefined אם לחץ 'ביטול'
        if (result) {
          this.onFormSubmit(result); // השתמש בפונקציה הקיימת לטיפול בשליחת הטופס (שתבדיל בין הוספה לעריכה)
        }
        // אין צורך ב-onFormCancel כאן, כי הדיאלוג נסגר והמצב כבר טופל
      });
    }
  }


  // פונקציה שנשלחת מה-CourseListComponent בלחיצה על "מחק"
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
              this.loadCourses(); // רענן את רשימת הקורסים לאחר המחיקה
              this.selectedCourseId = null; // איפוס הקורס הנבחר
              this.selectedCourse = null;
              // אופציונלי: הודעת סנאק-בר על הצלחה
            },
            error: (err) => {
              this.error = err.message || 'Failed to delete course';
              // אופציונלי: הודעת סנאק-בר על שגיאה
            },
          });
      }
    });
  }

  // פונקציה המטפלת בשליחת הטופס (הוספה או עריכה)
  onFormSubmit(courseData: Course): void {
    if (courseData.id && courseData.id !== 0) { // אם יש ID (שונה מ-0, כי אנחנו מאתחלים ל-0) - זה עדכון
      this.courseService
        .updateCourse(courseData.id,courseData) // הנחתי שקיימת פונקציית updateCourse בסרוויס
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadCourses(); // רענן את רשימת הקורסים
            this.onFormCancel(); // איפוס מצב הטופס
            // אופציונלי: הודעת סנאק-בר על הצלחה
          },
          error: (err) => {
            this.error = err.message || 'Failed to update course';
            // אופציונלי: הודעת סנאק-בר על שגיאה
          },
        });
    } else { // אם אין ID או ID הוא 0 - זה הוספה
      this.courseService
        .addCourse(courseData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadCourses(); // רענן את רשימת הקורסים
            this.onFormCancel(); // איפוס מצב הטופס
            // אופציונלי: הודעת סנאק-בר על הצלחה
          },
          error: (err) => {
            this.error = err.message || 'Failed to add course';
            // אופציונלי: הודעת סנאק-בר על שגיאה
          },
        });
    }
  }

  // פונקציה המטפלת בביטול הטופס (סגירת הטופס ואיפוס מצב)
  onFormCancel(): void {
    this.selectedCourseId = null;
    this.selectedCourse = null;
    this.isAddingNewCourse = false;
  }
  onAddCourse(): void {
    this.isAddingNewCourse = true;
    this.selectedCourseId = null;
    this.selectedCourse = { id: 0, title: '', description: '', teacherId: 0 };
  }


}








