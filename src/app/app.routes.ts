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
    loadComponent: () => import('./admin-login/admin-login.page').then(m => m.AdminLoginPage)
  },
  {
    path: 'user-list',
    loadComponent: () => import('./user-list/user-list.page').then(m => m.UserListPage)
  },
  {
    path: 'user-login',
    loadComponent: () => import('./user-list/user-login/user-login.page').then(m => m.UserLoginPage)
  },
  {
    path: 'tarea-pasos',
    loadComponent: () => import('./tarea-pasos/tarea-pasos.page').then(m => m.TareaPasosPage)
  },
  {
    path: 'tarea-material',
    loadComponent: () => import('./tarea-material/tarea-material.page').then(m => m.TareaMaterialPage)
  },
  {
    path: 'crear-usuario',
    loadComponent: () => import('./crear-usuario/crear-usuario.page').then(m => m.CrearUsuarioPage)
  },
  {
    path: 'tarea-comanda',
    loadComponent: () => import('./tarea-comanda/tarea-comanda.page').then(m => m.TareaComandaPage)
  },
  {
    path: 'asignar-tarea',
    loadComponent: () => import('./asignar-tarea/asignar-tarea.page').then(m => m.AsignarTarea)
  },
  {
    path: 'agenda',
    loadComponent: () => import('./agenda/agenda.page').then(m => m.AgendaPage)
  },
  {
    path: 'editar-menu',
    loadComponent: () => import('./editar-menu/editar-menu.page').then(m => m.EditarMenuPage)
  },
  {
    path: 'modificar-tarea-pasos',
    loadComponent: () => import('./modificar-tarea-pasos/modificar-tarea-pasos.page').then( m => m.ModificarTareaPasosPage)
  },
  {
    path: 'crear-tarea-comanda',
    loadComponent: () => import('./crear-tarea-comanda/crear-tarea-comanda.page').then(m => m.CrearTareaComandaPage)
  },
  {
    path: 'modificar-tarea-material',
    loadComponent: () => import('./modificar-tarea-material/modificar-tarea-material.page').then( m => m.ModificarTareaMaterialPage)
  },
  {
    path: 'perfil-admin-profesor',
    loadComponent: () => import('./perfil-admin-profesor/perfil-admin-profesor.page').then( m => m.PerfilAdminProfesorPage)
  },  {
    path: 'solicitar-material-profe',
    loadComponent: () => import('./solicitar-material-profe/solicitar-material-profe.page').then( m => m.SolicitarMaterialProfePage)
  },
  {
    path: 'gestionar-material-admin',
    loadComponent: () => import('./gestionar-material-admin/gestionar-material-admin.page').then( m => m.GestionarMaterialAdminPage)
  },
  {
    path: 'gestionar-tareas',
    loadComponent: () => import('./gestionar-tareas/gestionar-tareas.page').then( m => m.GestionarTareasPage)
  },



];
