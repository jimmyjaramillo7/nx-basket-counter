import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../interfaces/authStatus.enum';

export const isLoggedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  localStorage.setItem('board-lastUrl', state.url);

  if (authService.authStatus() === AuthStatus.AUTHENTICATED) {
    return true;
  }
  if (authService.authStatus() === AuthStatus.CHECKING) {
    return false;
  }
  router.navigateByUrl('login');
  return false;
};
