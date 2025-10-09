// shared/components/navbar/navbar.ts
import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { TokenService } from '../../../core/services/token.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, FontAwesomeModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  faUserCircle = faUserCircle;
  isMobileOpen = false;
  isDropdownOpen = false;

  private token = inject(TokenService);
  private router = inject(Router);

  toggleDropdown() { this.isDropdownOpen = !this.isDropdownOpen; }
  closeDropdown() { this.isDropdownOpen = false; }
  toggleMobileMenu() { this.isMobileOpen = !this.isMobileOpen; }
  closeMobileMenu() { this.isMobileOpen = false; }

  isLoggedIn() {
    return this.token.isLoggedIn();
  }
  logout() {
    this.token.clear();
    this.router.navigate(['/home']);
  }

  // Normaliza para tu template: name + email
  get user() {
    const u = this.token.getUser<{ nombre: string; apellidos: string; correo: string }>();
    if (!u) return null;
    return {
      name: `${u.nombre} ${u.apellidos}`.trim(),
      email: u.correo
    };
  }
}
