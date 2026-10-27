import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    title: 'Sign in',
    loadComponent: () =>
      import('./pages/login/login').then((m) => m.Login)
  },
  {
    path: 'dashboard',
    title: 'Dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard').then((m) => m.Dashboard)
  },
  {
    path: 'students',
    title: 'Students',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/students/students').then((m) => m.Students)
  },
  {
    path: 'teachers',
    title: 'Teachers',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/teachers/teachers').then((m) => m.Teachers)
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];