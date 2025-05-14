import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet,RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon'; // ייבוא MatIconModule
import { CommonModule } from '@angular/common';
import { CoursesComponent } from './courses/courses.component';
import { CoursesManagementComponent } from './courses-management/courses-management.component';
import { RegisterComponent } from './register/register.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginComponent } from './login/login.component';
import { AuthService } from './services/auth.service';
import { MyCoursesComponent } from './my-courses/my-courses.component';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-root',
  imports: [ MatCardModule,
    RouterLink,
    MatButtonModule,
    CommonModule,
    MatIconModule,
    RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Project';
  isUserLoggedIn: boolean = false; // משתנה המציין האם המשתמש מחובר
  loggedInSubscription: Subscription | undefined; // משתנה שיכיל את ההרשמה ל-Observable של מצב הלוגין

  // הזרקת תלויות: Router לניווט ו-AuthService לניהול מצב האותנטיקציה
  constructor(private router: Router, private authService: AuthService) {}

  // מתודה שנקראת לאחר יצירת הקומפוננטה
  ngOnInit(): void {
    // קוראים לשירות כדי לבדוק את מצב הלוגין הנוכחי בעת טעינת האפליקציה
    this.isUserLoggedIn = this.authService.isLoggedIn();

    // נרשמים ל-Observable של מצב הלוגין מהשירות.
    // בכל פעם שהערך של מצב הלוגין בשירות משתנה, הפונקציה בתוך ה-subscribe תרוץ
    this.loggedInSubscription = this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.isUserLoggedIn = loggedIn; // עדכון המשתנה המקומי בהתאם למצב הלוגין בשירות
    });
  }

  // מתודה שנקראת לפני שהקומפוננטה נהרסת
  ngOnDestroy(): void {
    // חשוב לבטל את ההרשמה ל-Observable כדי למנוע דליפות זיכרון
    if (this.loggedInSubscription) {
      this.loggedInSubscription.unsubscribe();
    }
  }

  // מתודה לביצוע לוגאוט
  logOut(): void {
    this.authService.logout(); // קוראים למתודת הלוגאוט בשירות
    // השירות כבר מטפל בהסרת הטוקן ועדכון ה-Observable,
    // כך שה-AppComponent יקבל את השינוי דרך ה-subscribe
    // אין צורך לבצע כאן עדכון ידני של isUserLoggedIn או ניווט,
    // כי השירות עושה זאת. הסרתי את window.location.reload() כי זה פחות רצוי.
  }
}