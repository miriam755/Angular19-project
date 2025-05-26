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
import { log } from 'console';
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
    this.showDetails = false;
    console.log('Toggle Lessons:', {
      showLessons: this.showLessons,
      hasLessons: this.lessons !== null, // זה בודק אם הוא לא null
      lessonsLength: this.lessons ? this.lessons.length : 'null', // בדוק את האורך בפועל
      loadingLessons: this.loadingLessons,
      courseId: this.course?.id
    });
  
    // *** שינוי קריטי כאן: לשנות את התנאי שיפעיל את ה-loadLessons.emit() ***
    // עכשיו נבדוק אם showLessons = true, וגם אם השיעורים לא נטענו (lessons הוא null)
    // או אם הם נטענו אבל הרשימה ריקה (lessons.length === 0)
    // וגם אם לא נמצאים כבר בטעינה.
    if (this.showLessons && (!this.lessons || this.lessons.length === 0) && !this.loadingLessons) {
      console.log('Loading lessons for the first time...');
      this.loadLessons.emit(); // כאן האירוע ייפלט!
      console.log('Course ID (for emit):', this.course?.id);
    }
    //
    // הוסף את else if הזה כדי להבחין בין טעינה מוצלחת לטעינה ריקה
    else if (this.showLessons && this.lessons && this.lessons.length > 0) {
        console.log('Lessons already loaded (and not empty):', this.lessons.length);
    } else if (this.showLessons && this.lessons && this.lessons.length === 0) {
        // המקרה הזה יקרה אם ה-API החזיר מערך ריק, אבל הקומפוננטה חושבת שהיא "סיימה לטעון"
        console.log('Lessons loaded, but the list is empty (length is 0).');
    }
    //
    else if (this.loadingLessons) {
      console.log('Lessons are still loading...');
    } else {
      // זה המקרה שבו showLessons הוא false (כלומר סגרת את השיעורים)
      console.log('Lessons not loaded and not loading (or lessons are being hidden).');
    }
  }
 

  onJoin(): void {
    this.join.emit();
  }

  onLeave(): void {
    
    this.leave.emit();
  }
}