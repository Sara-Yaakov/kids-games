import { Routes } from '@angular/router';
import { authGuard, guestGuard, loggedInMatch } from './core/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canMatch: [loggedInMatch],
    title: 'עולם החכמים',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: '',
    pathMatch: 'full',
    title: 'עולם החכמים | משחקי חשיבה לילדים',
    loadComponent: () => import('./pages/landing/landing').then((m) => m.Landing),
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    title: 'כניסה | עולם החכמים',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'games',
    canActivate: [authGuard],
    children: [
      {
        path: 'animals',
        title: 'ספארי השמות | עולם החכמים',
        loadComponent: () => import('./games/animals/animals').then((m) => m.Animals),
      },
      {
        path: 'instruments',
        title: 'בלונים מוזיקליים | עולם החכמים',
        loadComponent: () => import('./games/instruments/instruments').then((m) => m.Instruments),
      },
      {
        path: 'countries',
        title: 'מסע סביב העולם | עולם החכמים',
        loadComponent: () => import('./games/countries/countries').then((m) => m.Countries),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
