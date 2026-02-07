import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SecureLs } from '../secure-ls';

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const secureLs = inject(SecureLs);
  
  let token = null;
  try {
    token = secureLs.get('token');
  } catch (error) {
    console.warn('Failed to get token from secure storage:', error);
  }
  
  if (token) {
    return true;
  } else {
    router.navigate(['']);
    return false;
  }
};
