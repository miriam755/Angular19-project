import { Component, OnInit } from '@angular/core';
import { CourseService } from '../services/course.service';
import { CommonModule } from '@angular/common';
import { Course } from '../models/course.model';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CourseDetailsComponent } from '../course-details/course-details.component'; // ייבוא קומפוננטת הפרטים
import { Lesson } from '../models/lesson.model ';

interface CourseDisplayState {
    showDetails: boolean;
    showLessons: boolean;
    lessons: Lesson[] | null;
    loadingLessons: boolean;
    errorLessons: string | null;
}

@Component({
    selector: 'app-my-courses',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatListModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule, CourseDetailsComponent], // הוספת CourseDetailsComponent לייבוא
    templateUrl: './my-courses.component.html',
    styleUrl: './my-courses.component.css'
})
export class MyCoursesComponent implements OnInit {
    myCourses: Course[] = [];
    loading: boolean = true;
    error: string = '';
    courseDisplayStates: { [courseId: number]: CourseDisplayState } = {};

    constructor(private courseService: CourseService) { }

    ngOnInit(): void {
        this.loadMyCourses();
    }

    loadMyCourses(): void {
        this.loading = true;
        this.error = '';
        const studentId = this.getStudentId();
        if (studentId) {
            this.courseService.getCoursesByStudentId(studentId).subscribe({
                next: (courses) => {
                    this.myCourses = courses;
                    this.myCourses.forEach(course => {
                        this.courseDisplayStates[course.id] = {
                            showDetails: false,
                            showLessons: false,
                            lessons: null,
                            loadingLessons: false,
                            errorLessons: null
                        };
                    });
                    this.loading = false;
                },
                error: (err) => {
                    this.error = 'אירעה שגיאה בטעינת הקורסים שלך.';
                    this.loading = false;
                    console.error('שגיאה בטעינת הקורסים שלי:', err);
                }
            });
        } else {
            this.error = 'לא ניתן לזהות את המשתמש.';
            this.loading = false;
        }
    }

    getStudentId(): number | null {
        if (typeof window !== 'undefined' && window.localStorage) {
            const token = localStorage.getItem('authToken');
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

    toggleCourseDetails(courseId: number): void {
        this.courseDisplayStates[courseId].showDetails = !this.courseDisplayStates[courseId].showDetails;
        this.courseDisplayStates[courseId].showLessons = false; // סגירת שיעורים בעת פתיחת פרטים
    }

    loadCourseLessons(courseId: number): void {
        const state = this.courseDisplayStates[courseId];
        state.showLessons = !state.showLessons;
        state.showDetails = false; // סגירת פרטים בעת פתיחת שיעורים
        if (state.showLessons && !state.lessons && !state.loadingLessons) {
            state.loadingLessons = true;
            this.courseService.getLessonsByCourseId(courseId).subscribe({
                next: (lessons) => {
                    state.lessons = lessons;
                    state.loadingLessons = false;
                },
                error: (err) => {
                    state.errorLessons = 'אירעה שגיאה בטעינת רשימת השיעורים';
                    state.loadingLessons = false;
                    console.error('שגיאה בטעינת רשימת השיעורים:', err);
                }
            });
        }
    }
}