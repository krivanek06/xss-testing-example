import { afterNextRender, Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header';
import { AppState } from './services/app-state';
import { User } from './services/data.model';
import { customDecodeToken } from './services/utils.model';

@Component({
  imports: [RouterOutlet, HeaderComponent],
  selector: 'app-root',
  template: `
    <app-header />
    <router-outlet />
  `,
  styles: [``],
})
export class App {
  private readonly appState = inject(AppState);
  private readonly router = inject(Router);

  constructor() {
    // check URL for token on initial load - user authenticated
    afterNextRender(() => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token') as string | null;

      if (!token) {
        return;
      }

      const decodedToken = customDecodeToken<User>(token);

      if (decodedToken) {
        // clean URL to remove token param
        window.history.replaceState({}, document.title, '/');

        console.log({
          token: token,
          decodedToken: decodedToken,
        });

        this.appState.setData('token', token);
        this.appState.setData('user', decodedToken);

        localStorage.setItem('access_token', token);
      }
    });

    // check if token exists in localStorage on app start
    afterNextRender(() => {
      const storedToken = localStorage.getItem('access_token');
      if (!storedToken) {
        return;
      }

      console.log('Found stored token in localStorage:', storedToken);
      this.appState.setData('token', storedToken);

      const decodedToken = customDecodeToken<User>(storedToken);
      if (decodedToken) {
        this.appState.setData('user', decodedToken);
        this.router.navigate(['/overview']);
      }
    });
  }

  /**
   * Helper to determine initial state purely from environment
   */
  // private getInitialToken(): string | null {
  //   const params = new URLSearchParams(window.location.search);
  //   const urlToken = params.get('token');

  //   if (urlToken) return urlToken;
  //   return localStorage.getItem('access_token');
  // }
}
