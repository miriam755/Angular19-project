import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

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
    loginSuccess: boolean = false;
    loggedInUserName: string = '';

    constructor(
        private fb: FormBuilder,
        private UserService: UserService,
        private router: Router,
        private authService: AuthService
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
                    // *** שינוי כאן: קבלת התפקיד מהתגובה של השרת ***
                    const role = response.role; // וודא שהשרת שולח את השדה 'role'

                    if (token && role) { // וודא שגם הטוקן וגם התפקיד קיימים
                        console.log('Token:', token);
                        console.log('Role:', role);

                        // אין צורך לשמור את הטוקן ישירות ב-sessionStorage כאן,
                        // כי ה-AuthService יעשה זאת עבורך.
                        // sessionStorage.setItem('authToken', token);

                        // *** השינוי המרכזי: שליחת הטוקן והתפקיד ל-AuthService ***
                        this.authService.login(token, role); // שלח את ה-token ואת ה-role

                        this.loginSuccess = true;
                        this.errorMessage = '';
                    } else {
                        this.errorMessage = 'התגובה מהשרת לא הכילה טוקן או תפקיד.';
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
}