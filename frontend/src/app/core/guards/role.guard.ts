import {CanActivateFn, Router} from '@angular/router';
import {TokenService} from '../services/token.service';
import {inject} from '@angular/core';

export const RoleGuard: CanActivateFn = (route, state) => {
  const tokenService= inject(TokenService);
  const router = inject(Router);
  const user = tokenService.getUser<{rol?:string}>();
  const expectedRoles=route.data?.['roles'] as string[];
  if (user && expectedRoles.includes (user.rol || '')) {
    return true
  }

  router.navigate(['/home']);
  return false;


  return true;
};
