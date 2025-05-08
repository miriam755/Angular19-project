import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

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
MatIconModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  providers: [UserService]
})
export class RegisterComponent {
  registrationForm: FormGroup;
  errorMessage: string = '';

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
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.errorMessage = 'אירעה שגיאה בהרשמה.';
          console.error('שגיאת הרשמה:', err);
        }
      });
      console.log('Registered:', this.registrationForm.value);
    } else {
      this.errorMessage = 'נא למלא את כל השדות בצורה תקינה.';
    }
  }

  get formControls() {
    return this.registrationForm.controls;
  }
}