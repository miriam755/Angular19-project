import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon'; // ייבוא MatIconModule
import { CommonModule } from '@angular/common';
import { CoursesComponent } from './courses/courses.component';
import { CoursesManagementComponent } from './courses-management/courses-management.component';
import { RegisterComponent } from './register/register.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginComponent } from './login/login.component';
import { MyCoursesComponent } from './my-courses/my-courses.component';
@Component({
  selector: 'app-root',
  imports: [ MatCardModule,
    RouterLink,
    MatButtonModule,
    CommonModule,
    MatIconModule,RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Project';
}