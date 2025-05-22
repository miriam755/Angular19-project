import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CoursesComponent } from './components/courses/courses.component';
import { CourseDetailsComponent } from './components/course-details/course-details.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { CoursesManagementComponent } from './components/courses-management/courses-management.component';
import { MyCoursesComponent } from './components/my-courses/my-courses.component';
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