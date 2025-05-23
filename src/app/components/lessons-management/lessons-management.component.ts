// src/app/components/lessons-management/lessons-management.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // לייבוא ה-Router וה-ActivatedRoute
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // אם נרצה דיאלוג לאישור מחיקה
import { Subject, takeUntil } from 'rxjs';
import { Lesson } from '../../models/lesson.model ';
import { LessonService } from '../../services/lesson.service';
import { CourseService } from '../../services/course.service'; // אם נרצה להציג את שם הקורס
import { Course } from '../../models/course.model';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component'; // לדיאלוג מחיקה

@Component({
  selector: 'app-lessons-management',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogModule, // לדיאלוג מחיקה
  ],
  templateUrl: './lessons-management.component.html',
  styleUrls: ['./lessons-management.component.css'],
})
export class LessonsManagementComponent implements OnInit, OnDestroy {
  courseId!: number;
  courseTitle: string = ''; // לשמירת שם הקורס
  lessons: Lesson[] = [];
  loading = true;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  lessonForm: FormGroup;
  isAddingNewLesson: boolean = false;
  selectedLesson: Lesson | null = null; // לטעינת נתוני שיעור לעריכה

  constructor(
    private route: ActivatedRoute, // לקבלת ה-ID מה-URL
    private router: Router,       // לניווט
    private lessonService: LessonService,
    private courseService: CourseService, // להביא את שם הקורס
    private fb: FormBuilder,
    private dialog: MatDialog // לדיאלוג מחיקה
  ) {
    // אתחול טופס השיעור
    this.lessonForm = this.fb.group({
      id: [0], // עבור עדכון, אם זה שיעור קיים
      title: ['', Validators.required],
      content: ['', Validators.required],
   
    });
  }

  ngOnInit(): void {
    // קבלת ה-courseId מה-URL
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const id = params.get('courseId');
      if (id) {
        this.courseId = +id; // המרה למספר
        this.loadCourseDetails(); // טען פרטי קורס (שם)
        this.loadLessons();       // טען שיעורים עבור קורס זה
      } else {
        this.error = 'Course ID is missing in the URL.';
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // טעינת שם הקורס (אופציונלי)
  loadCourseDetails(): void {
    this.courseService.getCourseById(this.courseId) // הנחה שקיימת פונקציית getCourseById בסרוויס הקורסים
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (course: Course) => {
          this.courseTitle = course.title;
        },
        error: (err) => {
          console.error('Failed to load course details:', err);
          this.courseTitle = 'קורס לא ידוע';
        },
      });
  }


  loadLessons(): void {
    this.loading = true;
    this.error = null;
    this.lessonService
      .getLessonsByCourseId(this.courseId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (lessons) => {
          this.lessons = lessons; // מיין לפי סדר
          this.loading = false;
        },
        error: (err) => {
          this.error = err.message || 'Failed to load lessons';
          this.loading = false;
        },
      });
  }

  onAddLesson(): void {
    this.isAddingNewLesson = true;
    this.selectedLesson = null; // איפוס שיעור נבחר
    this.lessonForm.reset({ id: 0 }); // אתחול שדות הטופס
  }

  onEditLesson(lesson: Lesson): void {
    this.isAddingNewLesson = false; // לא במצב הוספה
    this.selectedLesson = lesson; // קבע את השיעור הנבחר
    this.lessonForm.patchValue(lesson); // מלא את הטופס בערכי השיעור
  }

  onDeleteLesson(lesson: Lesson): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: { courseTitle: lesson.title }, // אפשר לשנות ל-lessonTitle אם הדיאלוג תומך
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.lessonService
          .deleteLesson(this.courseId,lesson.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.loadLessons(); // רענן את הרשימה
              // אופציונלי: הודעת הצלחה
            },
            error: (err) => {
              this.error = err.message || 'Failed to delete lesson';
              // אופציונלי: הודעת שגיאה
            },
          });
      }
    });
  }

  onFormSubmit(): void {
    if (this.lessonForm.valid) {
      const lessonData: Lesson = { ...this.lessonForm.value, courseId: this.courseId };

      if (lessonData.id && lessonData.id !== 0) {
        // עדכון שיעור קיים
        this.lessonService
          .updateLesson(this.courseId,lessonData.id, lessonData)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.loadLessons();
              this.onFormCancel();
              // אופציונלי: הודעת הצלחה
            },
            error: (err) => {
              this.error = err.message || 'Failed to update lesson';
            },
          });
      } else {
        // הוספת שיעור חדש
        this.lessonService
          .addLesson(this.courseId,lessonData)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.loadLessons();
              this.onFormCancel();
              // אופציונלי: הודעת הצלחה
            },
            error: (err) => {
              this.error = err.message || 'Failed to add lesson';
            },
          });
      }
    }
  }

  onFormCancel(): void {
    this.isAddingNewLesson = false;
    this.selectedLesson = null;
    this.lessonForm.reset(); // איפוס הטופס
  }

  // פונקציה לחזרה לדף ניהול הקורסים
  goBackToCoursesManagement(): void {
    this.router.navigate(['/settings']);
  }
}