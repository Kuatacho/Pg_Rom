import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button'; 
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-navbar',
  imports: [RouterModule, MatIconModule, MatButtonModule,FontAwesomeModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
faUserCircle=faUserCircle;

}