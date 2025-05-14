import { Component, OnInit } from '@angular/core';
import { CourseService } from '../services/course.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Course } from '../models/course.model';
import { Observable, of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CourseDetailsComponent } from '../course-details/course-details.component';
import { AsyncPipe } from '@angular/common';
import { Lesson} from '../models/lesson.model ';

// ייבוא מודולים של Angular Material שבהם נשתמש
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar'; // אם תרצה להציג הודעות
import { log } from 'console';

interface CourseDisplayState {
  showDetails: boolean;
  showLessons: boolean;
  lessons: Lesson[] | null; // מאפשר null
  loadingLessons: boolean;
  errorLessons: string | null|undefined; // מאפשר null
}

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    // HttpClientModule,
    CourseDetailsComponent,
    // הוספת מודולים של Angular Material לייבוא
    MatProgressSpinnerModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatSnackBarModule
],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  loadingCourses: boolean = true;
  errorCourses: string = '';
  courseDisplayStates: { [courseId: number]: CourseDisplayState } = {};
  enrolledCourseIds: number[] = []; // שמור רק את ה-IDs

  constructor(private courseService: CourseService, private router: Router, private snackBar: MatSnackBarModule) { }

  ngOnInit(): void {
    console.log(1);
    
    this.loadCourses();
     console.log(2);
     

  }

  public getStudentId(): number | null {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const token = sessionStorage.getItem('authToken');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          return payload?.userId;
        } catch (error) {
          console.error('שגיאה בפענוח הטוקן:', error);
          return null;
        }
      }
    }
    return null;
  }

  loadCourses(): void {
    console.log(3);
    
    this.loadingCourses = true;
    console.log(4);
    
    this.errorCourses = '';
console.log(5);

console.log('Change Detection רץ');
    this.courseService.getAllCourses().subscribe({
      next: (courses) => {
        console.log('Change Detection רץ');
        console.log('קורסים שהתקבלו:', courses);
        this.courses.length=0;
        courses.forEach(course=>this.courses.push(course))
        console.log('this.courses לאחר עדכון:', this.courses);
        console.log(this.courses[1]);
        
        this.courses.forEach(course => {
        
          console.log(course.id);
          
          this.courseDisplayStates[course.id] = {
            showDetails: false,
            showLessons: false,
            lessons: null, // אתחול ל-null
            loadingLessons: false,
            errorLessons: null // אתחול ל-null
          };
        });
        this.loadingCourses = false;
        console.log(this.loadingCourses);
        
      },
      error: (err) => {
        this.errorCourses = 'אירעה שגיאה בטעינת הקורסים';
        console.error('שגיאה בטעינת קורסים:', err);
        this.loadingCourses = false;
      }
    });
  }

  loadCourseDetails(courseId: number): void {
    this.courseDisplayStates[courseId].showDetails = !this.courseDisplayStates[courseId].showDetails;
    this.courseDisplayStates[courseId].showLessons = false;
  }

  loadCourseLessons(courseId: number): void {
    const state = this.courseDisplayStates[courseId];
    state.showLessons = !state.showLessons;
    state.showDetails = false;
    if (state.showLessons && !state.lessons && !state.loadingLessons) { // בדיקה אם lessons הוא null
      state.loadingLessons = true;
      state.errorLessons = null;
      this.courseService.getLessonsByCourseId(courseId).subscribe({
        next: (lessons) => {
          state.lessons = lessons;
          state.loadingLessons = false;
        },
        error: (err) => {
          state.errorLessons = 'אירעה שגיאה בטעינת רשימת השיעורים';
          console.error('שגיאה בטעינת רשימת השיעורים:', err);
          state.loadingLessons = false;
        }
      });
    }
  }

  joinCourse(courseId: number): void {
    const studentId = this.getStudentId();
    if (studentId !== null) {
      this.courseService.enrollInCourse(courseId, studentId).subscribe({
        next: (response) => {
          console.log('הצטרפות לקורס הצליחה:', response);
          this.loadCourses();
          // דוגמה להצגת הודעה עם MatSnackBar
          // this.snackBar.open('הוצטרפת לקורס בהצלחה!', 'סגור', { duration: 3000 });
        },
        error: (err) => {
          console.error('שגיאה בהצטרפות לקורס:', err);
          this.errorCourses = 'אירעה שגיאה בהצטרפות לקורס';
          // דוגמה להצגת הודעת שגיאה עם MatSnackBar
          // this.snackBar.open('אירעה שגיאה בהצטרפות לקורס.', 'סגור', { duration: 5000 });
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
          this.loadCourses();
          // דוגמה להצגת הודעה עם MatSnackBar
          // this.snackBar.open('עזבת את הקורס בהצלחה.', 'סגור', { duration: 3000 });
        },
        error: (err) => {
          console.error('שגיאה בעזיבת הקורס:', err);
          this.errorCourses = 'אירעה שגיאה בעזיבת הקורס';
          // דוגמה להצגת הודעת שגיאה עם MatSnackBar
          // this.snackBar.open('אירעה שגיאה בעזיבת הקורס.', 'סגור', { duration: 5000 });
        }
      });
    }
  }

  isUserEnrolled(courseId: number): Observable<boolean>  {
    const studentId = this.getStudentId();
    if (studentId !== null) {
      return this.courseService.isUserEnrolled(courseId, studentId);
    } else {
      return of(false);
    }
  }
}