
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon'; // ייבוא MatIconModule
import { CommonModule } from '@angular/common';
import { WelcomeAnimationComponent } from '../welcome-animation/welcome-animation.component';
@Component({
  selector: 'app-home-page',
  imports: [
    WelcomeAnimationComponent,
    MatCardModule,
    RouterLink,
    MatButtonModule,
    CommonModule,
    MatIconModule // הוספת MatIconModule למערך ה-imports
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

}
