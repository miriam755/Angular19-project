// src/app/services/lesson.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lesson } from '../models/lesson.model ';
@Injectable({
  providedIn: 'root'
})
export class LessonService {

  // ה-URL הבסיסי של ה-API עבור קורסים, מכיוון שכל הנקודות קצה של השיעורים מקושרות לקורסים.
  private baseUrl = 'http://localhost:3000/api/courses';

  constructor(private http: HttpClient) { }

  /**
   * בונה את ה-HttpHeaders כולל טוקן אימות (אם קיים ב-sessionStorage).
   * @returns HttpHeaders.
   */
  private getAuthHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    // ודא שהקוד רץ בצד הלקוח (ב-browser) לפני ניסיון גישה ל-window או sessionStorage
    if (typeof window !== 'undefined' && sessionStorage.getItem('authToken')) {
      const token = sessionStorage.getItem('authToken');
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  /**
   * מקבלת רשימת כל השיעורים בקורס מסוים.
   * Endpoint: GET http://localhost:3000/api/courses/:courseId/lessons
   * הרשאות: נדרש Token של משתמש מחובר.
   * @param courseId מזהה הקורס.
   * @returns Observable של מערך שיעורים.
   */
  getLessonsByCourseId(courseId: number): Observable<Lesson[]> {
    const url = `${this.baseUrl}/${courseId}/lessons`;
    return this.http.get<Lesson[]>(url, { headers: this.getAuthHeaders() });
  }

  /**
   * מקבלת פרטי שיעור בודד לפי מזהה השיעור ומזהה הקורס.
   * Endpoint: GET http://localhost:3000/api/courses/:courseId/lessons/:id
   * הרשאות: נדרש Token של משתמש מחובר.
   * @param courseId מזהה הקורס שאליו שייך השיעור.
   * @param lessonId מזהה השיעור.
   * @returns Observable של אובייקט שיעור.
   */
  getLessonById(courseId: number, lessonId: number): Observable<Lesson> {
    const url = `${this.baseUrl}/${courseId}/lessons/${lessonId}`;
    return this.http.get<Lesson>(url, { headers: this.getAuthHeaders() });
  }

  /**
   * יוצרת שיעור חדש בקורס מסוים.
   * Endpoint: POST http://localhost:3000/api/courses/:courseId/lessons
   * הרשאות: נדרש Token של מורה.
   * @param courseId מזהה הקורס שאליו שייך השיעור.
   * @param lessonData אובייקט השיעור החדש (צריך להכיל title ו-content). ה-courseId אינו נכלל כאן בגוף הבקשה כי הוא כבר ב-URL.
   * @returns Observable עם הודעת הצלחה ו-lessonId (כפי שצוין ב-Response).
   */
  addLesson(courseId: number, lessonData: { title: string; content: string }): Observable<{ message: string; lessonId: number }> {
    const url = `${this.baseUrl}/${courseId}/lessons`;
    return this.http.post<{ message: string; lessonId: number }>(url, lessonData, { headers: this.getAuthHeaders() });
  }

  /**
   * מעדכנת פרטי שיעור לפי מזהה.
   * Endpoint: PUT http://localhost:3000/api/courses/:courseId/lessons/:id
   * הרשאות: נדרש Token של מורה.
   * @param courseId מזהה הקורס שאליו שייך השיעור.
   * @param lessonId מזהה השיעור לעדכון.
   * @param lessonData אובייקט השיעור המעודכן (צריך להכיל title ו-content).
   * @returns Observable עם הודעת הצלחה.
   */
  updateLesson(courseId: number, lessonId: number, lessonData: { title: string; content: string }): Observable<{ message: string }> {
    const url = `${this.baseUrl}/${courseId}/lessons/${lessonId}`;
    return this.http.put<{ message: string }>(url, lessonData, { headers: this.getAuthHeaders() });
  }

  /**
   * מוחקת שיעור לפי מזהה.
   * Endpoint: DELETE http://localhost:3000/api/courses/:courseId/lessons/:id
   * הרשאות: נדרש Token של מורה.
   * @param courseId מזהה הקורס שאליו שייך השיעור.
   * @param lessonId מזהה השיעור למחיקה.
   * @returns Observable של כל תגובה מהשרת (לרוב אין תוכן, רק סטטוס 200/204).
   */
  deleteLesson(courseId: number, lessonId: number): Observable<any> {
    const url = `${this.baseUrl}/${courseId}/lessons/${lessonId}`;
    return this.http.delete(url, { headers: this.getAuthHeaders() });
  }
}