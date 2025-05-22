import { Component, OnInit, Inject } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Course } from '../../models/course.model';
import { Observable, of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CourseDetailsComponent } from '../course-details/course-details.component';
import { AsyncPipe } from '@angular/common';
import { Lesson } from '../../models/lesson.model ';

// ייבוא מודולים של Angular Material שבהם נשתמש
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar'; // אם תרצה להציג הודעות

interface CourseDisplayState {
  lessons: Lesson[] | null; // מאפשר null
  loadingLessons: boolean;
  errorLessons: string | null | undefined; // מאפשר null
}

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    CourseDetailsComponent,
    MatProgressSpinnerModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatIconModule
  ],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  loadingCourses: boolean = true;
  errorCourses: string = '';
  courseDisplayStates: { [courseId: number]: CourseDisplayState } = {};
  enrolledCourseIds: number[] = []; // שמור רק את ה-IDs

  constructor(
    @Inject(CourseService) private courseService: CourseService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadCourses();
  }

  public getStudentId(): number {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const token = sessionStorage.getItem('authToken');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          return payload?.userId;
        } catch (error) {
          console.error('שגיאה בפענוח הטוקן:', error);
          return -1;
        }
      }
    }
    //TODO NAVIGATR
    return -1;
  }

  loadCourses(): void {
    this.loadingCourses = true;
    this.errorCourses = '';
    this.courseService.getAllCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.courses.forEach(course => {
          this.courseDisplayStates[course.id] = {
            lessons: null, // אתחול ל-null
            loadingLessons: false,
            errorLessons: null // אתחול ל-null
          };
     
          
        });
        this.getCoursesByStudentId(this.getStudentId())
        this.loadingCourses = false;
      },
      error: (err) => {
        this.errorCourses = 'אירעה שגיאה בטעינת הקורסים';
        console.error('שגיאה בטעינת קורסים:', err);
        this.loadingCourses = false;
        this.snackBar.open('שגיאה בטעינת הקורסים. נסה שוב.', 'סגור', { duration: 5000, panelClass: ['error-snackbar'] });

      }
    });
  }

  joinCourse(courseId: number): void {
    const studentId = this.getStudentId();
    if (studentId !== null) {
      this.courseService.enrollInCourse(courseId, studentId).subscribe({
        next: (response) => {
          console.log('הצטרפות לקורס הצליחה:', response);
          this.loadCourses(); // רענון רשימת הקורסים כדי לעדכן את מצב ההרשמה
        },
        error: (err) => {
          console.error('שגיאה בהצטרפות לקורס:', err);
         
          this.errorCourses = 'אירעה שגיאה בהצטרפות לקורס';

        }
      });
    }
  }

  leaveCourse(courseId: number): void {
    const studentId = this.getStudentId();
    if (studentId !== null) {
      this.courseService.unenrollFromCourse(courseId, studentId).subscribe({
        next: (response) => {
          console.log('עזיבת הקורס הצליחה:', response);
          this.loadCourses(); // רענון רשימת הקורסים כדי לעדכן את מצב ההרשמה
        },
        error: (err) => {
          console.error('שגיאה בעזיבת הקורס:', err);
          this.errorCourses = 'אירעה שגיאה בעזיבת הקורס';
        }
      });
    }
  }

  isUserEnrolled(courseId: number): Observable<boolean> {
    const studentId = this.getStudentId();
    if (studentId !== null) {
      return this.courseService.isUserEnrolled(courseId, studentId);
    } else {
      return of(false);
    }
  }

  loadCourseLessons(courseId: number): Observable<Lesson[]> {
    const state = this.courseDisplayStates[courseId];
    if (!state.lessons && !state.loadingLessons) {
      state.loadingLessons = true;
      state.errorLessons = null;
      return this.courseService.getLessonsByCourseId(courseId);
    } else if (state.lessons) {
      return of(state.lessons);
    } else {
      return of([]); // או Observable.empty(), תלוי בהתנהגות הרצויה
    }
  }
  getCoursesByStudentId(studentId: number) {
    this.courseService.getCoursesByStudentId(studentId).subscribe(
      data => data.forEach(f => {
        let current = this.courses.find(c => c.id == f.id)
        if (current != null) {
  
         this.courses =  this.courses.map(obj => obj.id === current?.id ? { ...obj, isEnrolled:true } : obj );
        
          }
      }
      )
    )
  }
}