import { Component, OnInit, OnDestroy } from '@angular/core'; // הוסף OnDestroy
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { CoursesComponent } from './components/courses/courses.component';
import { CoursesManagementComponent } from './components/courses-management/courses-management.component';
import { RegisterComponent } from './components/register/register.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LoginComponent } from './components/login/login.component';
import { AuthService } from './services/auth.service';
import { Subscription, Observable } from 'rxjs'; // הוסף Observable לכאן
import { map } from 'rxjs/operators'; // הוסף map לכאן

@Component({
  selector: 'app-root',
  standalone: true, // וודא ש-standalone: true מוגדר כאן אם אתה משתמש ב-Angular 17+
  imports: [
    MatCardModule,
    RouterLink,
    MatButtonModule,
    CommonModule,
    MatIconModule,
    RouterOutlet
    // אין צורך לייבא קומפוננטות ראוט בתוך ה-imports של ה-App
    // CoursesComponent, CoursesManagementComponent, RegisterComponent,
    // HomePageComponent, LoginComponent, MyCoursesComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy { // וודא ש-OnDestroy מיושם
  title = 'Project';
  isUserLoggedIn: boolean = false;
  loggedInSubscription: Subscription | undefined;

  // *** חדש: Observable שיגיד לנו אם המשתמש הוא מורה ***
  isTeacherUser$: Observable<boolean>;

  constructor(private router: Router, private authService: AuthService) {
    // בבנאי, אתחל את ה-Observable. הוא יתחיל להאזין ברגע שהקומפוננטה תיבנה.
    this.isTeacherUser$ = this.authService.userRole$.pipe(
      map(role => role === 'teacher') // ממפים את התפקיד ל-true אם הוא 'teacher', אחרת false
    );
  }

  ngOnInit(): void {
    // קוראים לשירות כדי לבדוק את מצב הלוגין הנוכחי בעת טעינת האפליקציה
    this.isUserLoggedIn = this.authService.isLoggedIn();

    // נרשמים ל-Observable של מצב הלוגין מהשירות.
    // בכל פעם שהערך של מצב הלוגין בשירות משתנה, הפונקציה בתוך ה-subscribe תרוץ
    this.loggedInSubscription = this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.isUserLoggedIn = loggedIn; // עדכון המשתנה המקומי בהתאם למצב הלוגין בשירות
    });
  }

  ngOnDestroy(): void {
    // חשוב לבטל את ההרשמה ל-Observable כדי למנוע דליפות זיכרון
    if (this.loggedInSubscription) {
      this.loggedInSubscription.unsubscribe();
    }
    // אין צורך לבטל הרשמה ל-isTeacherUser$ מכיוון שאנו משתמשים ב-async pipe ב-HTML
    // והוא מטפל ב-unsubscribe אוטומטית.
  }

  logOut(): void {
    this.authService.logout();
  }
}