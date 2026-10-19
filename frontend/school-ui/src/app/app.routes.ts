import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard')
        .then(m => m.Dashboard)
  },
  {
    path: 'students',
    title: 'Students',
    loadComponent: () =>
      import('./pages/students/students')
        .then(m => m.Students)
  },
  {
    path: 'teachers',
    title: 'Teachers',
    loadComponent: () =>
      import('./pages/teachers/teachers')
        .then(m => m.Teachers)
  },
  {
    path: '**',
    redirectTo: ''
  }
];