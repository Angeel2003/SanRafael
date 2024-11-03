import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tareaPasos',
    loadComponent: () => import('./tareaPasos/tareaPasos.page').then((m) => m.TareaPasosPage),
  },
  {
    path: '',
    redirectTo: 'tareaPasos',
    pathMatch: 'full',
  },
  {
    path: 'admin-login',
    loadComponent: () => import('./admin-login/admin-login.page').then( m => m.AdminLoginPage)
  },
  {
    path: 'user-list',
    loadComponent: () => import('./user-list/user-list.page').then( m => m.UserListPage)
  },
  {
    path: 'user-login',
    loadComponent: () => import('./user-list/user-login/user-login.page').then( m => m.UserLoginPage)
  },
];
