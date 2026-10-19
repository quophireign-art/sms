
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Teacher } from '../../models/teacher';
import { TeacherService } from '../../services/teacher.service';
import { DataRefreshService } from '../../services/data-refresh.service';

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './teachers.html',
  styleUrl: './teachers.css'
})
export class Teachers implements OnInit {
  private teacherService = inject(TeacherService);

  private dataRefreshService = inject(DataRefreshService);

  teachers: Teacher[] = [];
loading = false;
isSaving = false;

showForm = false;
editingId: string | null = null;
errorMessage = '';
successMessage = '';

  form: Teacher = this.emptyForm();

  ngOnInit(): void {
    this.loadTeachers();
  }

  emptyForm(): Teacher {
    return {
      fullname: '',
      age: 18,
      telephone: '',
      email: ''
    };
  }


searchTerm = '';

get filteredTeachers(): Teacher[] {
  const term = this.searchTerm.trim().toLowerCase();

  if (!term) {
    return this.teachers;
  }

  return this.teachers.filter(teacher =>
    teacher.fullname.toLowerCase().includes(term) ||
    teacher.telephone.toLowerCase().includes(term) ||
    teacher.email.toLowerCase().includes(term)
  );
}


  loadTeachers(): void {
  this.loading = true;
  this.errorMessage = '';

  this.teacherService.getTeachers().subscribe({
    next: (data) => {
      this.teachers = data;
      this.loading = false;
    },
    error: (error) => {
      console.error('Error loading teachers:', error);

      this.errorMessage =
        error.status === 0
          ? 'Cannot connect to the backend. Check Spring Boot and CORS.'
          : `Could not load teachers (HTTP ${error.status}).`;

      this.loading = false;
    }
  });
}

  openCreateForm(): void {
    this.form = this.emptyForm();
    this.editingId = null;
    this.errorMessage = '';
    this.successMessage = '';
    this.showForm = true;
  }

  editTeacher(teacher: Teacher): void {
    if (!teacher.id) {
      return;
    }

    this.form = { ...teacher };
    this.editingId = teacher.id;
    this.errorMessage = '';
    this.successMessage = '';
    this.showForm = true;
  }

  saveTeacher(): void {
  if (this.isSaving) {
    return;
  }

  this.errorMessage = '';
  this.successMessage = '';
  this.isSaving = true;

  const isEditing = this.editingId !== null;

  const request = isEditing
    ? this.teacherService.updateTeacher(
        this.editingId!,
        this.form
      )
    : this.teacherService.createTeacher(this.form);

  request.subscribe({
    next: (savedTeacher) => {
      if (isEditing) {
        this.teachers = this.teachers.map(teacher =>
          teacher.id === this.editingId
            ? savedTeacher
            : teacher
        );
      } else {
        this.teachers = [...this.teachers, savedTeacher];
      }

      this.dataRefreshService.notifyDataChanged();

      this.successMessage = isEditing
        ? 'Teacher updated successfully.'
        : 'Teacher registered successfully.';

      this.showForm = false;
      this.form = this.emptyForm();
      this.editingId = null;
      this.isSaving = false;
    },
    error: (error) => {
      console.error('Error saving teacher:', error);

      this.errorMessage =
        error.status === 0
          ? 'Cannot connect to the backend. Check Spring Boot and CORS.'
          : `Could not save teacher (HTTP ${error.status}).`;

      this.isSaving = false;
    }
  });
}

  deleteTeacher(teacher: Teacher): void {
    if (!teacher.id) {
      return;
    }

    if (!confirm(`Delete ${teacher.fullname}? This cannot be undone.`)) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.teacherService.deleteTeacher(teacher.id).subscribe({
      next: () => {
        this.teachers = this.teachers.filter(
          existingTeacher => existingTeacher.id !== teacher.id
        );

        this.dataRefreshService.notifyDataChanged();

        this.successMessage = 'Teacher deleted successfully.';
      },
      error: (error) => {
        console.error('Error deleting teacher:', error);

        this.errorMessage =
          error.status === 0
            ? 'Cannot connect to the backend. Check Spring Boot and CORS.'
            : `Could not delete teacher (HTTP ${error.status}).`;
      }
    });
  }

  cancelForm(): void {
    this.showForm = false;
    this.form = this.emptyForm();
    this.editingId = null;
    this.errorMessage = '';
  }
}
