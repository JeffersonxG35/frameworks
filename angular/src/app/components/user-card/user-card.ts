import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from '../../user.model';

@Component({
  selector: 'app-user-card',
  imports: [RouterLink],
  template: `
    <article class="user-card">
      <h2>{{ user().name }}</h2>
      <dl class="user-data">
        <div><dt>Correo</dt><dd>{{ user().email }}</dd></div>
        <div><dt>Ciudad</dt><dd>{{ user().address.city }}</dd></div>
      </dl>
      <div class="card-actions">
        <button
          type="button"
          class="button"
          [class.button--selected]="favorite()"
          [attr.aria-pressed]="favorite()"
          [attr.aria-label]="(favorite() ? 'Quitar favorito a ' : 'Favorito: marcar a ') + user().name"
          (click)="favoriteToggled.emit(user().id)"
        >
          {{ favorite() ? 'Quitar favorito' : 'Favorito' }}
        </button>
        <a
          class="detail-link"
          [routerLink]="['/users', user().id]"
          [attr.aria-label]="'Ver detalle de ' + user().name"
        >Ver detalle</a>
      </div>
    </article>
  `,
})
export class UserCard {
  readonly user = input.required<User>();
  readonly favorite = input(false);
  readonly favoriteToggled = output<number>();
}
