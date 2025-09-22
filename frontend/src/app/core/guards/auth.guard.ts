import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthMockService } from '../services/auth-mock.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthMockService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  const allowed = isPlatformBrowser(platformId) ? auth.isLoggedIn() : true;
  if (!allowed) { router.navigateByUrl('/login'); return false; }
  return true;
};
