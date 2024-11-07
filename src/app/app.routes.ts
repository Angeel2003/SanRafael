import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'agenda',
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
  {
    path: 'tarea-pasos',
    loadComponent: () => import('./tarea-pasos/tarea-pasos.page').then( m => m.TareaPasosPage)
  },
  {
    path: 'tarea-material',
    loadComponent: () => import('./tarea-material/tarea-material.page').then( m => m.TareaMaterialPage)
  },
  {
    path: 'admin-dentro',
    loadComponent: () => import('./admin-dentro/admin-dentro.page').then( m => m.AdminDentro)
  },
  {
    path: 'agenda',
    loadComponent: () => import('./agenda/agenda.page').then( m => m.AgendaPage)
  },



];
