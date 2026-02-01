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
    <main class="max-w-[1060px] mx-auto">
      <router-outlet />
    </main>
  `,
  styles: [``],
})
export class App {
  private readonly appState = inject(AppState);
  private readonly router = inject(Router);

  constructor() {
    const storedToken = localStorage.getItem('access_token');

    if (storedToken) {
      const decodedToken = customDecodeToken<User>(storedToken);

      // decoded token is valid, restore session
      if (decodedToken) {
        this.authenticateWithToken(storedToken);
      }
    }

    afterNextRender(() => {
      // use the URL object to manipulate params without wiping others
      const url = new URL(window.location.href);
      const token = url.searchParams.get('token');

      if (!token) {
        return;
      }

      const decodedToken = customDecodeToken<User>(token);

      if (decodedToken) {
        console.log('Authenticated via URL');

        // remove token from URL to prevent leaks
        url.searchParams.delete('token');
        window.history.replaceState({}, document.title, url.toString());

        this.authenticateWithToken(token);
      }
    });
  }

  private authenticateWithToken(token: string) {
    this.appState.authenticateWithToken(token).subscribe({
      next: user => {
        this.appState.setData('token', token);
        this.appState.setData('user', user);

        localStorage.setItem('access_token', token);

        this.router.navigateByUrl('/overview');
      },
      error: err => {
        console.error('Token authentication failed', err);
        this.appState.setData('token', null);
        this.appState.setData('user', null);

        localStorage.removeItem('access_token');
      },
    });
  }
}
