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
];
