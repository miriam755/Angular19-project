import { Component, Input } from '@angular/core';
import { Course } from '../models/course.model';
import { Lesson } from '../models/lesson.model ';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.css'
})
export class CourseDetailsComponent {
  @Input() course: Course | null = null;
  @Input() lessons: Lesson[] | null = null;
  @Input() showDetails: boolean = false;
  @Input() showLessons: boolean = false;
  @Input() loadingLessons: boolean = false;
  @Input() errorLessons: string = '';
}