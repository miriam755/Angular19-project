

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs'; // הוסף Observable
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());
  isLoggedIn$ = this.loggedIn.asObservable();

  // חדש: BehaviorSubject עבור תפקיד המשתמש
  private userRoleSubject = new BehaviorSubject<string | null>(null);
  userRole$: Observable<string | null> = this.userRoleSubject.asObservable();

  constructor(private router: Router) {
    // בבניית השירות, נסה לטעון את התפקיד מ-sessionStorage אם קיים
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const storedRole = sessionStorage.getItem('userRole');
      if (storedRole) {
        this.userRoleSubject.next(storedRole);
      }
    }
  }

  isLoggedIn(): boolean {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return !!sessionStorage.getItem('authToken');
    }
    return false;
  }

  // עדכן את פונקציית login כדי לקבל גם תפקיד
  login(token: string, role: string): void { // הוספנו פרמטר 'role'
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.setItem('authToken', token);
      sessionStorage.setItem('userRole', role); // שמור את התפקיד ב-sessionStorage
    }
    this.userRoleSubject.next(role); // עדכן את ה-BehaviorSubject
    this.loggedIn.next(true);
    this.router.navigate(['/']);
  }

  logout(): void {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('userRole'); // הסר את התפקיד
    }
    this.userRoleSubject.next(null); // אפס את התפקיד
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  // חדש: פונקציה לבדיקה האם המשתמש הוא מורה
  isTeacher(): boolean {
    return this.userRoleSubject.getValue() === 'teacher';
  }
}