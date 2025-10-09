import {CanActivate, Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {TokenService} from '../services/token.service';


@Injectable({providedIn: 'root'})
export class AuthGuard  {
  constructor(private token: TokenService, private router: Router) {}

  canActivate():boolean{
    if (this.token.isLoggedIn()) return true;
    this.router.navigate(['/auth/login']);
    return false;
  }

}
