import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Subject, takeUntil, forkJoin, of } from 'rxjs';

import { catchError } from 'rxjs/operators';
import { RouterLink } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { TeacherService } from '../../services/teacher.service';
import { Student } from '../../models/student';
import { DataRefreshService } from '../../services/data-refresh.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, OnDestroy {
  private studentService = inject(StudentService);
  private teacherService = inject(TeacherService);
  private dataRefreshService = inject(DataRefreshService);
  private destroy$ = new Subject<void>();

  recentStudents: Student[] = [];

  totalStudents = 0;
  totalTeachers = 0;

  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.dataRefreshService.dataChanged$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.loadDashboard();
    });

    this.loadDashboard();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDashboard(): void {
    this.loading = true;
    this.errorMessage = '';

    forkJoin({
      students: this.studentService.getStudents().pipe(
        catchError((error) => {
          console.error('Could not load students:', error);
          return of(null);
        }),
      ),

      teachers: this.teacherService.getTeachers().pipe(
        catchError((error) => {
          console.error('Could not load teachers:', error);
          return of(null);
        }),
      ),
    }).subscribe({
      next: ({ students, teachers }) => {
        if (students !== null) {
          this.totalStudents = students.length;
          this.recentStudents = [...students].reverse().slice(0, 5);
        }

        if (teachers !== null) {
          this.totalTeachers = teachers.length;
        }

        if (students === null && teachers === null) {
          this.errorMessage =
            'Could not load student or teacher information. Check that the backend is running.';
        } else if (students === null) {
          this.errorMessage = 'Could not load student information. Check the backend.';
        } else if (teachers === null) {
          this.errorMessage = 'Could not load teacher information. Check the backend.';
        }

        this.loading = false;
      },

      error: (error) => {
        console.error('Unexpected dashboard error:', error);

        this.errorMessage = 'An unexpected error occurred while loading the dashboard.';
        this.loading = false;
      },
    });
  }
}
