import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private router: Router) { }

  isLoggedIn(): boolean {
    // בדוק אם האובייקט window קיים (סביבת דפדפן)
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return !!sessionStorage.getItem('authToken');
    }
    return false; // אם לא בדפדפן, החזר false
  }

  login(token: string): void {
    // בדוק אם האובייקט window קיים (סביבת דפדפן)
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.setItem('authToken', token);
    }
    this.loggedIn.next(true);
    this.router.navigate(['/']);
  }

  logout(): void {
    // בדוק אם האובייקט window קיים (סביבת דפדפן)
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.removeItem('authToken');
    }
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }
}