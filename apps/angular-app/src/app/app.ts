import { afterNextRender, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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

  constructor() {
    const storedToken = localStorage.getItem('access_token');

    if (storedToken) {
      const decodedToken = customDecodeToken<User>(storedToken);

      // decoded token is valid, restore session
      if (decodedToken) {
        this.appState.setData('token', storedToken);
        this.appState.setData('user', decodedToken);
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

        // store in app state and local storage
        this.appState.setData('token', token);
        this.appState.setData('user', decodedToken);
        localStorage.setItem('access_token', token);
      }
    });
  }
}
