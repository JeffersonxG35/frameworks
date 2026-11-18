import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="app">
      <a class="skip-link" href="#contenido">Saltar al contenido</a>
      <header class="app-header">
        <div class="header-inner">
          <a routerLink="/" class="brand">Usuarios <span>/ Angular</span></a>
          <p class="favorite-count" role="status">Favoritos: {{ service.favoriteCount() }}</p>
        </div>
      </header>
      <main id="contenido" class="main" tabindex="-1">
        <router-outlet />
      </main>
      <footer class="app-footer">Programación Web</footer>
    </div>
  `,
})
export class App {
  protected readonly service = inject(UserService);
}
