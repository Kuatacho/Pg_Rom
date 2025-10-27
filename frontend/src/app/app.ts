import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Home } from "./features/home/home";
import { Navbar } from "./shared/components/navbar/navbar";
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { HandPrediction } from './features/learning/components/hand-prediction/hand-prediction';

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
