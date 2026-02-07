import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { AuthInterceptor } from '../app/allowed/auth';
import { AuthGuard } from './allowed/auth.guard';
import { Dashboard } from './pages/dashboard/dashboard';
import { TaskDetail } from './pages/task-detail/task-detail';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./login/login').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register').then(m => m.Register)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [AuthGuard]
  },
  {
    path: 'task/:id',
    loadComponent: () => import('./pages/task-detail/task-detail').then(m => m.TaskDetail),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
