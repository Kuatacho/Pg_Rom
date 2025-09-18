import { Routes } from '@angular/router';
import { Modulos } from './features/modulos/modulos';
import { Home } from './features/home/home';
import { Learning } from './features/learning/learning';
import { HandPrediction } from './features/hand-prediction/components/hand-prediction'; // importa el componente standalone

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'modulos', component: Modulos },
  { path: 'learning', component: Learning },
  { path: 'hand-prediction', component: HandPrediction } // ahora standalone
];
