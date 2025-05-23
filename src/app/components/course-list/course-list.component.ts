// src/app/components/course-list/course-list.component.ts

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Course } from '../../models/course.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

// *** ייבוא CourseDetailsComponent ***
import { CourseDetailsComponent } from '../course-details/course-details.component'; // וודא שהנתיב נכון

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    CourseDetailsComponent // *** הוספה: ייבוא CourseDetailsComponent ***
  ],
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {
  ngOnInit(): void {
   
  }
  @Input() courses: Course[] = [];
  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<{ courseId: number; title: string }>();
  @Output() editLessons = new EventEmitter<number>();

  // אין צורך לשנות את ה-constructor או ngOnInit

  onEdit(courseId: number): void {
    this.edit.emit(courseId);
  }

  onDelete(courseId: number, title: string): void {
    this.delete.emit({ courseId, title });
  }

  onEditLessonsClicked(courseId: number): void {
    this.editLessons.emit(courseId);
  }
}