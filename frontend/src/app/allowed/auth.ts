import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { SecureLs } from '../secure-ls';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const secureLs = inject(SecureLs);
  
  let token = null;
  try {
    token = secureLs.get('token');
  } catch (error) {
    console.warn('Failed to get token from secure storage:', error);
  }

  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        secureLs.clear();
        router.navigate(['']);
      }
      return throwError(() => error);
    })
  );
};
