import { Component, OnInit } from '@angular/core';
import { Course } from '../models/course.model';
import { CourseService } from '../services/course.service';
import { Subject, Observable, of } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CourseDetailsComponent } from '../course-details/course-details.component';
@Component({
  selector: 'app-my-courses',
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.css'],
  standalone: true,
  imports: [CommonModule,MatCardModule, MatListModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule,CourseDetailsComponent],
})
export class MyCoursesComponent implements OnInit {
  myCourses: Course[] = [];
  loadingCourses = true;
  errorCourses: string | null = null;
  courseDisplayStates: { [courseId: number]: { showDetails: boolean; showLessons: boolean; lessons: any[]; loadingLessons: boolean; errorLessons: string | null;    showLeaveButton: boolean; // הוספנו את המאפיין הזה
} } = {};

  constructor(private courseService: CourseService) { }

  ngOnInit(): void {
    this.loadMyCourses();
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
  loadMyCourses(): void {
    this.loadingCourses = true;
    this.errorCourses = null;
    const studentId = this.getStudentId();
    if (studentId !== null) {
      this.courseService.getCoursesByStudentId(studentId)
       
        .subscribe({
          next: (courses) => {
            this.myCourses = courses;
            this.loadingCourses = false;
            this.initializeDisplayStates();
          },
          error: (error) => {
            this.errorCourses = error.message || 'Failed to load my courses.';
            this.loadingCourses = false;
          }
        });
    } else {
      this.errorCourses = 'לא ניתן לטעון קורסים: מזהה סטודנט לא זמין.';
      this.loadingCourses = false;
    }
  }
  initializeDisplayStates(): void {
    this.myCourses.forEach(course => {
      this.courseDisplayStates[course.id] = {
        showDetails: false,
        showLessons: false,
        lessons: [],
        loadingLessons: false,
        errorLessons: null,  
        showLeaveButton: true // הגדרנו את כפתור העזיבה כגלוי כברירת מחדל

      };
    });
  }

  loadCourseDetails(courseId: number): void {
    this.courseDisplayStates[courseId].showDetails = !this.courseDisplayStates[courseId].showDetails;
    this.courseDisplayStates[courseId].showLessons = false;
    // כאן יכולה להיות לוגיקה נוספת לטעינת פרטים אם צריך
  }

  loadCourseLessons(courseId: number): void {
    this.courseDisplayStates[courseId].showLessons = !this.courseDisplayStates[courseId].showLessons;
    this.courseDisplayStates[courseId].showDetails = false;
    if (this.courseDisplayStates[courseId].showLessons && !this.courseDisplayStates[courseId].lessons.length) {
      this.courseDisplayStates[courseId].loadingLessons = true;
      this.courseService.getLessonsByCourseId(courseId)
       
        .subscribe({
          next: (lessons) => {
            this.courseDisplayStates[courseId].lessons = lessons;
            this.courseDisplayStates[courseId].loadingLessons = false;
          },
          error: (error) => {
            this.courseDisplayStates[courseId].errorLessons = error.message || 'Failed to load lessons.';
            this.courseDisplayStates[courseId].loadingLessons = false;
          }
        });
    }
  }


  leaveCourse(courseId: number): void {
    const studentId = this.getStudentId();
    if (studentId !== null) {
      this.courseService.unenrollFromCourse(courseId, studentId)
       
        .subscribe({
          next: (response) => {
            console.log('Successfully unenrolled:', response);
            this.loadMyCourses(); // רענון רשימת הקורסים שלי
            // ... הצגת הודעה למשתמש
          },
          error: (error) => {
            console.error('Error unenrolling:', error);
            // ... הצגת הודעת שגיאה למשתמש
          }
        });
    }
  }
}