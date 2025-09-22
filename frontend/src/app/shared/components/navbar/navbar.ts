import { Component,inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AuthMockService } from '../../../core/services/auth-mock.service';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-navbar',
  
  imports: [RouterModule, 
     FontAwesomeModule,
     CommonModule

  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  faUserCircle = faUserCircle;
  // ✅ Nuevo: menú mobile
  isMobileOpen = false;
  isDropdownOpen = false;
  
// ✅ Nuevo: inyectar AuthService y Router
 private auth = inject(AuthMockService);
  private router = inject(Router);

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  closeDropdown() {
    this.isDropdownOpen = false;
  }
  toggleMobileMenu() {
    this.isMobileOpen = !this.isMobileOpen;
  }
  closeMobileMenu() {
    this.isMobileOpen = false;
  }

  //
  isLoggedIn(){
    return this.auth.isLoggedIn();
  }
  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  //
    get user() { return this.auth.getUser(); }

}