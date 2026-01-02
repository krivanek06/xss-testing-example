import { inject } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AppState } from './services/app-state';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: '/overview',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/need-login-page').then(m => m.NeedLoginPage),
  },
  {
    path: 'overview',
    canActivate: [
      () => {
        const isUser = !!inject(AppState).publicState().user;
        const router = inject(Router);

        if (!isUser) {
          // Redirect to login if not authenticated
          router.navigate(['/login']);
          return false;
        }

        return true;
      },
    ],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/overview-page').then(m => m.OverviewPage),
      },
    ],
  },
];
