import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Course } from '../../models/course.model';
import { Lesson } from '../../models/lesson.model ';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatListModule, MatIconModule, MatCardModule,MatProgressSpinnerModule],
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.css'
})
export class CourseDetailsComponent {
  
  @Input() course: Course | null = null;
  @Input() lessons: Lesson[] | null = null;
  @Input() loadingLessons: boolean | null = false;
  @Input() errorLessons: string | null | undefined = '';
  @Input() studentId: number | null = null;
  @Output() join = new EventEmitter<void>();
  @Output() leave = new EventEmitter<void>();
  @Output() loadLessons = new EventEmitter<void>();

  showDetails: boolean = false;
  showLessons: boolean = false;

  toggleDetails(): void {
    this.showDetails = !this.showDetails;
    this.showLessons = false; // סגירת רשימת שיעורים בעת פתיחת פרטים
  }

  toggleLessons(): void {
    this.showLessons = !this.showLessons;
    this.showDetails = false; // סגירת פרטים בעת פתיחת רשימת שיעורים
    if (this.showLessons && !this.lessons && !this.loadingLessons) {
      this.loadLessons.emit();
    }
  }

  onJoin(): void {
    this.join.emit();
  }

  onLeave(): void {
    
    this.leave.emit();
  }
}