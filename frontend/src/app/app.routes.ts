import { Routes } from '@angular/router';
import { Modulos } from './components/modulos/modulos';
import { Home } from './components/home/home';
import { Learning } from './components/learning/learning';
import { HandPrediction } from './components/hand-prediction/hand-prediction'; // importa el componente standalone

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'modulos', component: Modulos },
  { path: 'learning', component: Learning },
  { path: 'hand-prediction', component: HandPrediction } // ahora standalone
];
