import { Routes } from '@angular/router';
import  { Login } from './login/login';
import { Register } from './register/register';
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
      path: '**',
      redirectTo: ''
   }
];
