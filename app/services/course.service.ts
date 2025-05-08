import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,map } from 'rxjs';
import { Course } from '../models/course.model';
import { Lesson } from '../models/lesson.model ';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private apiUrl = 'http://localhost:3000/api/courses'; // כתובת ה-API של השרת שלך

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken'); // או מקום אחר שבו הטוקן מאוחסן
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`); // פורמט נפוץ, בדוק את דרישות ה-API שלך
    }
    return headers;
  }

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getCourseById(id: number): Observable<Course> {
    const url = `${this.apiUrl}/${id}`; // בניית כתובת API עם ה-ID
    return this.http.get<Course>(url, { headers: this.getAuthHeaders() }); // בקשת GET לקורס בודד
  }

  getLessonsByCourseId(courseId: number): Observable<Lesson[]> {
    const url = `${this.apiUrl}/${courseId}/lessons`;
    return this.http.get<Lesson[]>(url, { headers: this.getAuthHeaders() });
  }

  enrollInCourse(courseId: number, userId: number): Observable<any> {
    const body = { userId }; // בהתאם ל-API, ייתכן שלא צריך body
    return this.http.post(`${this.apiUrl}/${courseId}/enroll`, body, { headers: this.getAuthHeaders() });
  }

  unenrollFromCourse(courseId: number, userId: number): Observable<any> {
    const url = `${this.apiUrl}/${courseId}/unenroll`;
    const body = { userId }; // שולחים רק userId בגוף הבקשה
    return this.http.delete(url, { headers: this.getAuthHeaders(), body });
  }
  isUserEnrolled(courseId: number, studentId: number): Observable<boolean> {
    const headers = this.getAuthHeaders();
    const url = `${this.apiUrl}/student/:${studentId}`;
    return this.http.get<Course[]>(url, { headers }).pipe(
      map((courses:Course[]) => {
        return courses.some((course:Course) => course.id === courseId);
      })
    );
  }
  deleteCourse(courseId: number): Observable<any> {
    const url = `${this.apiUrl}/${courseId}`;
    const headers = this.getAuthHeaders();
    return this.http.delete(url, { headers });
  }
  updateCourse(courseId: number,courseData: Course): Observable<any> {
  const url = `${this.apiUrl}/${courseId}`;
  const headers = this.getAuthHeaders();
  return this.http.put(url,courseData, { headers });
  }
  addCourse(courseData: Course): Observable<any> {
    const url = `${this.apiUrl}`;
    const headers = this.getAuthHeaders();
    return this.http.post(url, courseData, { headers });
  }
}