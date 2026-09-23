import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    title: 'כניסה | עולם החכמים',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        title: 'עולם החכמים',
        loadComponent: () => import('./pages/home/home').then((m) => m.Home),
      },
      {
        path: 'games/animals',
        title: 'ספארי השמות | עולם החכמים',
        loadComponent: () => import('./games/animals/animals').then((m) => m.Animals),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
