import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // ---------- PÚBLICAS ----------
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/home').then(m => m.Home),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/components/login/login').then(m => m.Login),
  },
  {
    path: 'recuperar',
    loadComponent: () =>
      import('./features/auth/components/forgot/forgot').then(m => m.Forgot),
  },

  // ---------- PRIVADAS (AUTENTICADAS) ----------

  // --- Rutas accesibles solo a usuarios con rol "Estudiante" ---
  {
    path: 'lecciones',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Estudiante'] },
    loadComponent: () =>
      import('./features/learning/components/lessons-list/lessons-list').then(
        m => m.LessonsList
      ),
  },
  {
    path: 'lecciones/:id/gestos',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Estudiante'] },
    loadComponent: () =>
      import('./features/learning/components/gestures-list/gestures-list').then(m => m.GesturesListComponent)
  },
  {
    path: 'lecciones/:id/gestos/:gestoId/practica',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Estudiante'] },
    loadComponent: () =>
      import('./features/hand-prediction/components/hand-prediction').then(m => m.HandPrediction)
  },

  {
    path: 'hand-prediction',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Estudiante'] },
    loadComponent: () =>
      import('./features/hand-prediction/components/hand-prediction').then(
        m => m.HandPrediction
      ),
  },

  // --- Acceso general autenticado (por ejemplo profesores o ambos roles) ---
  {
    path: 'notas',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/admin/components/notas-estudiantes/notas-estudiantes').then(
        m => m.NotasEstudiantesComponent
      ),
  },

  // ---------- ADMINISTRADOR ----------
  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Administrador'] },
    loadComponent: () =>
      import('./features/admin/components/admin-layout/admin-layout').then(
        m => m.AdminLayout
      ),
    children: [
      { path: '', redirectTo: 'register', pathMatch: 'full' },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/admin/components/register-form/register-form').then(
            m => m.RegisterForm
          ),
      },
      {
        path: 'notas',
        loadComponent: () =>
          import('./features/admin/components/notas-estudiantes/notas-estudiantes').then(
            m => m.NotasEstudiantesComponent
          ),
      },
      {
        path: 'list-usuarios',
        loadComponent: () =>
          import('./features/admin/components/list-usuarios/list-usuarios').then(
            m => m.ListUsuarios
          ),
      },
    ],
  },

  // ---------- WILDCARD ----------
  { path: '**', redirectTo: '/home' },
];
