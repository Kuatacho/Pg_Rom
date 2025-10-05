import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

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
    import('./features/auth/forgot/forgot')
      .then(m => m.Forgot),
},
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login')
        .then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/admin/components/register-form/register-form')
        .then(m => m.RegisterFormComponent),
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
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/modulos/modulos').then(m => m.Modulos),
  },
  {
    path: 'learning',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/learning/learning').then(m => m.Learning),
  },
  {
    path: 'hand-prediction',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/hand-prediction/components/hand-prediction')
        .then(m => m.HandPrediction),
  },
  {
    //to do dashboard
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard')
        .then(m => m.Dashboard),
  },

  // ---------- WILDCARD ----------
  { path: '**', redirectTo: '/home' },
];
