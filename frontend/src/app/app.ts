import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Home } from "./components/home/home";
import { Navbar } from "./shared/navbar/navbar";
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';

import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-root',
   standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    HttpClientModule
    
],  
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'frontend';
}
