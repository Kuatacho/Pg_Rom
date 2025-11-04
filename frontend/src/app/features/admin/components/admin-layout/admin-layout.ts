// admin-layout.ts
import { Component } from '@angular/core';
import {
  faChartBar,
  faRightFromBracket,
  faUserPlus,
  faUsersGear
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TokenService } from '../../../../core/services/token.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, RouterModule],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {
  faUserPlus = faUserPlus;
  faChartBar = faChartBar;
  faUsersGear = faUsersGear;
  faLogout = faRightFromBracket;

  constructor(private token: TokenService, private router: Router) {}

  logout() {
    this.token.clear();
    this.router.navigate(['/home']);
  }
}
