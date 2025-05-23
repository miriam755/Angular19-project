import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CoursesComponent } from './courses/courses.component';
import { CourseDetailsComponent } from './course-details/course-details.component';
import { HomePageComponent } from './home-page/home-page.component';
import { CoursesManagementComponent } from './courses-management/courses-management.component';
import { MyCoursesComponent } from './my-courses/my-courses.component';
import { AppComponent } from './app.component';
export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'courses', component: CoursesComponent },
  { path: 'courses/:id', component: CourseDetailsComponent },
  { path: 'my-courses', component: MyCoursesComponent }, // הוספת הנתיב החדש
  {path:'settings',component:CoursesManagementComponent},
  { path: '**', redirectTo: '' },
 
];