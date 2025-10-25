import {Routes} from '@angular/router';
import {AuthGuard} from './core/guards/auth.guard';
import {RoleGuard} from './core/guards/role.guard';

export const routes: Routes = [
  // ----------   PÚBLICAS ----------
  {path: '', redirectTo: '/home', pathMatch: 'full'},

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


//ROL ADMIN!
  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    data: {roles: ['Administrador']},
    loadComponent: () =>
      import('./features/admin/components/admin-layout/admin-layout')
        .then(m => m.AdminLayout),
    children: [
      {
        path: '',
        redirectTo: 'register',
        pathMatch: 'full',
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/admin/components/register-form/register-form')
            .then(m => m.RegisterForm),
      },
      {
        path: 'notas',
        loadComponent: () =>
          import('./features/admin/components/notas-estudiantes/notas-estudiantes')
            .then(m => m.NotasEstudiantesComponent),
      },
      {
        path: 'list-usuarios',
        loadComponent: () =>
          import('./features/admin/components/list-usuarios/list-usuarios')
            .then(m => m.ListUsuarios)
      }

    ]

  },


  // ---------- WILDCARD ----------
  {path: '**', redirectTo: '/home'},
];
