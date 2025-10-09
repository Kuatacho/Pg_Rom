import { Routes } from '@angular/router';
import {AuthGuard} from './core/guards/auth.guard';

export const routes: Routes = [
  // ----------   PÚBLICAS ----------
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/home').then(m => m.Home),
  },
  {
  path: 'recuperar',
  loadComponent: () =>
    import('./features/auth/components/forgot/forgot')
      .then(m => m.Forgot),
},
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/components/login/login')
        .then(m => m.Login),
  },
  {
    path: 'register',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/auth/components/register/register')
        .then(m => m.Register),
  },
  {
    path: 'notas',
    loadComponent: () =>
      import('./features/admin/components/notas-estudiantes/notas-estudiantes')
        .then(m => m.NotasEstudiantesComponent),
  },

  // ---------- PRIVADAS ----------
  {
    path: 'modulos',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/modulos/modulos').then(m => m.Modulos),
  },
  {
    path: 'learning',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/learning/components/learning').then(m => m.Learning),
  },
  {
    path: 'hand-prediction',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/hand-prediction/components/hand-prediction')
        .then(m => m.HandPrediction),
  },
  // {
  //   //todo dashboard
  //   // path: 'dashboard',
  //   // canActivate: [authGuard],
  //   // loadComponent: () =>
  //   //   import('./features/dashboard/dashboard')
  //   //     .then(m => m.Dashboard),
  // },

  // ---------- WILDCARD ----------
  { path: '**', redirectTo: '/home' },
];
