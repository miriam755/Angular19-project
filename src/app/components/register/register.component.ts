import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
interface Role {
    viewValue: string;
    value: string;
  }
@Component({
    selector: 'app-register',
    standalone: true,
    imports: [ReactiveFormsModule,
        CommonModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        RouterLink], // הוספנו את RouterLink לייבוא
    templateUrl: './register.component.html',
    styleUrl: './register.component.css',
    providers: [UserService]
})
export class RegisterComponent {
    registrationForm: FormGroup;
    errorMessage: string = '';
    registrationSuccess: boolean = false; // דגל להצגת הודעת הצלחה וכפתור כניסה
    roles: Role[] = [
        { viewValue: 'תלמיד', value: 'student' },
        { viewValue: 'מורה', value: 'teacher' },
        { viewValue: 'מנהל', value: 'admin' },
      ];
    constructor(
        private fb: FormBuilder,
        public UserService: UserService,
        private router: Router
    ) {
        this.registrationForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            role: ['', Validators.required]
        });
    }

    onSubmit(): void {
        if (this.registrationForm.valid) {
       
                this.UserService.register(this.registrationForm.value).subscribe({
                next: (response: any) => {
                    console.log('הרשמה הצליחה:', response);
                    this.registrationSuccess = true; // עדכון הדגל להצגת ההודעה וכפתור הכניסה
                    this.errorMessage = ''; // איפוס הודעת שגיאה אם קיימת
                    // אין צורך יותר לנווט ישירות לכניסה מכאן, הכפתור החדש יעשה זאת
                },
                error: (err) => {
                    this.errorMessage = 'אירעה שגיאה בהרשמה.';
                    this.registrationSuccess = false; // מוודאים שהודעת ההצלחה לא מוצגת
                    console.error('שגיאת הרשמה:', err);
                }
            });
            console.log('Registered:', this.registrationForm.value);
        } else {
            this.errorMessage = 'נא למלא את כל השדות בצורה תקינה.';
            this.registrationSuccess = false; // מוודאים שהודעת ההצלחה לא מוצגת
        }
    }

    get formControls() {
        return this.registrationForm.controls;
    }
}