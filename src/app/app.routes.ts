import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
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
    path: 'crear-usuario',
    loadComponent: () => import('./crear-usuario/crear-usuario.page').then( m => m.CrearUsuarioPage)
  },  {
    path: 'tarea-comanda',
    loadComponent: () => import('./tarea-comanda/tarea-comanda.page').then( m => m.TareaComandaPage)
  },
  {
    path: 'crear-menu',
    loadComponent: () => import('./crear-menu/crear-menu.page').then(m => m.CrearMenuPage)
  },



];
