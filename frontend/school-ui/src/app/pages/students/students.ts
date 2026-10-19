
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Student } from '../../models/student';
import { StudentService } from '../../services/student.service';
import { DataRefreshService } from '../../services/data-refresh.service';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './students.html',
  styleUrl: './students.css'
})
export class Students implements OnInit {
  private studentService = inject(StudentService);
  private dataRefreshService = inject(DataRefreshService);

  students: Student[] = [];
  loading = false;
  isSaving = false;

  errorMessage = '';
  successMessage = '';

  showForm = false;
  editingId: string | null = null;
  searchTerm = '';

  form: Student = this.emptyForm();

  private emptyForm(): Student {
    return {
      fullname: '',
      age: 1,
      className: ''
    };
  }

  get filteredStudents(): Student[] {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      return this.students;
    }

    return this.students.filter(student =>
      student.fullname.toLowerCase().includes(term) ||
      student.className.toLowerCase().includes(term)
    );
  }

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;
    this.errorMessage = '';

    this.studentService.getStudents().subscribe({
      next: (data) => {
        this.students = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading students:', error);

        this.errorMessage =
          'Could not load students. Check that Spring Boot is running.';

        this.loading = false;
      }
    });
  }

  openCreateForm(): void {
    this.editingId = null;
    this.form = this.emptyForm();
    this.showForm = true;
    this.successMessage = '';
    this.errorMessage = '';
  }

  openEditForm(student: Student): void {
    this.editingId = student.id ?? null;
    this.form = { ...student };
    this.showForm = true;
    this.successMessage = '';
    this.errorMessage = '';
  }

  saveStudent(): void {
    // Prevent duplicate submissions.
    if (this.isSaving) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.isSaving = true;

    const isEditing = this.editingId !== null;

    const request = isEditing
      ? this.studentService.updateStudent(this.editingId!, this.form)
      : this.studentService.createStudent(this.form);

    request.subscribe({
      next: (savedStudent) => {
        if (isEditing) {
          // Replace the updated student in the table.
          this.students = this.students.map(student =>
            student.id === this.editingId
              ? savedStudent
              : student
          );
        } else {
          // Add the newly registered student immediately.
          this.students = [...this.students, savedStudent];
        }

        this.dataRefreshService.notifyDataChanged();

        this.successMessage = isEditing
          ? 'Student updated successfully.'
          : 'Student registered successfully.';

        this.showForm = false;
        this.form = this.emptyForm();
        this.editingId = null;
        this.isSaving = false;
      },
      error: (error) => {
        console.error('Error saving student:', error);

        this.errorMessage =
          error.status === 0
            ? 'Cannot connect to the backend. Check Spring Boot and CORS.'
            : `Could not save student (HTTP ${error.status}).`;

        this.isSaving = false;
      }
    });
  }

  deleteStudent(student: Student): void {
    if (!student.id) {
      return;
    }

    if (!confirm(`Delete ${student.fullname}? This cannot be undone.`)) {
      return;
    }

    

    this.errorMessage = '';
    this.successMessage = '';

    this.studentService.deleteStudent(student.id).subscribe({
      next: () => {
        this.students = this.students.filter(
          existingStudent => existingStudent.id !== student.id
        );

        this.dataRefreshService.notifyDataChanged();

        this.successMessage = 'Student deleted successfully.';
      },
      error: (error) => {
        console.error('Error deleting student:', error);

        this.errorMessage =
          error.status === 0
            ? 'Cannot connect to the backend. Check Spring Boot and CORS.'
            : `Could not delete student (HTTP ${error.status}).`;
      }
    });
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.form = this.emptyForm();
    this.errorMessage = '';
  }
}
