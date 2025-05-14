import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service'; // ייבוא השירות
@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CommonModule,
        HttpClientModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
    providers: [UserService]
})
export class LoginComponent implements OnInit {
    userForm: FormGroup;
    errorMessage: string = '';
    loginSuccess: boolean = false; // דגל להצגת הודעת הצלחה
    loggedInUserName: string = ''; // לאחסון שם המשתמש המחובר

    constructor(
        private fb: FormBuilder,
        private UserService: UserService,
        private router: Router,
        private authService: AuthService // הזרקת השירות
    ) {
        this.userForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    ngOnInit(): void { }

    onSubmit(): void {
        if (this.userForm.valid) {
            this.UserService.login(this.userForm.value).subscribe({
                next: (response: any) => {
                    const token = response.token;
                    if (token) {
                        console.log(token);
                        sessionStorage.setItem('authToken', token);
                        this.authService.login(token); // השתמש בשירות ללוגין
                        this.loginSuccess = true; // עדכון הדגל להצגת הודעת הצלחה
                    //    this.loggedInUserName = response.email.split('@')[0]; // נסה לקבל את השם, אחרת השתמש בחלק הראשון של האימייל
                        this.errorMessage = ''; // איפוס הודעת שגיאה
                        // הניווט לקורסים יתרחש לאחר שהמשתמש ילחץ על כפתור "המשך לקורסים"
                    } else {
                        this.errorMessage = 'התגובה מהשרת לא הכילה טוקן.';
                        this.loginSuccess = false;
                        this.loggedInUserName = '';
                    }
                    console.log('התחברות הצליחה:', response);
                },
                error: (err) => {
                    this.errorMessage = 'שם משתמש או סיסמה שגויים.';
                    this.loginSuccess = false;
                    this.loggedInUserName = '';
                    console.error('שגיאת התחברות:', err);
                }
            });
            console.log('Submitted:', this.userForm.value);
        } else {
            this.errorMessage = 'נא למלא את כל השדות בצורה תקינה.';
            this.loginSuccess = false;
            this.loggedInUserName = '';
        }
    }

    // navigateToCourses(): void {
    //     this.router.navigate(['/courses']);
    // }
}