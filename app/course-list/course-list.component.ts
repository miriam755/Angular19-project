import { Component , EventEmitter, Input, Output, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Course } from '../models/course.model';
import { MatTooltipModule } from '@angular/material/tooltip';
@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent {
  @Input() courses: Course[] = [];
  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<{ courseId: number; title: string }>();

  onEdit(courseId: number): void {
    this.edit.emit(courseId);
  }

  onDelete(courseId: number,title:string): void {
    this.delete.emit({courseId, title});
  }
}

