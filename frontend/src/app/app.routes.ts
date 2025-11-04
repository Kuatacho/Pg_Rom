import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // ----------  PÚBLICAS ----------
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

//  Nueva ruta: verificación de token
  {
    path: 'recuperar/verificar',
    loadComponent: () =>
      import('./features/auth/components/verify-token/verify-token').then(
        m => m.VerifyTokenComponent
      ),
  },

// Nueva ruta: formulario para resetear
  {
    path: 'auth/reset',
    loadComponent: () =>
      import('./features/auth/components/reset-password/reset-password').then(
        m => m.ResetPasswordComponent
      ),
  },


  // ---------- ESTUDIANTE (PRIVADAS CON ROLEGUARD) ----------
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
      import('./features/learning/components/gestures-list/gestures-list').then(
        m => m.GesturesListComponent
      ),
  },
  {
    path: 'lecciones/:leccionId/gestos/:gestoId/practica',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Estudiante'] },
    loadComponent: () =>
      import('./features/learning/components/hand-prediction/hand-prediction').then(
        m => m.HandPrediction
      ),
  },
  {
    path: 'lecciones/:leccionId/resultados',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Estudiante'] },
    loadComponent: () =>
      import('./features/learning/components/lesson-results/lesson-results').then(
        m => m.LessonResults
      ),
  },



  // ---------- 🛠️ ADMINISTRADOR ----------
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

  // ---------- ❓ WILDCARD ----------
  { path: '**', redirectTo: '/home' },
];
