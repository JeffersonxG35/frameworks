import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { User } from '../user.model';

const API_URL = 'https://jsonplaceholder.typicode.com/users';

function isUser(value: unknown): value is User {
  if (typeof value !== 'object' || value === null) return false;
  const user = value as Record<string, unknown>;
  const address = user['address'];

  return (
    typeof user['id'] === 'number' &&
    Number.isFinite(user['id']) &&
    typeof user['name'] === 'string' &&
    typeof user['email'] === 'string' &&
    typeof address === 'object' &&
    address !== null &&
    'city' in address &&
    typeof address.city === 'string'
  );
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);

  readonly users = signal<User[]>([]);
  readonly query = signal('');
  readonly favoriteIds = signal<number[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly loaded = signal(false);

  readonly filteredUsers = computed(() => {
    const search = this.query().trim().toLocaleLowerCase('es');
    return this.users().filter((user) => user.name.toLocaleLowerCase('es').includes(search));
  });

  readonly favoriteCount = computed(() => this.favoriteIds().length);

  async load(): Promise<void> {
    if (this.loading()) return;
    this.loading.set(true);
    this.error.set(null);

    try {
      const data = await firstValueFrom(this.http.get<unknown>(API_URL));
      if (!Array.isArray(data) || !data.every(isUser)) {
        throw new Error('La API devolvió usuarios con un formato inesperado.');
      }
      this.users.set(data);
      this.favoriteIds.update((ids) => ids.filter((id) => data.some((user) => user.id === id)));
      this.loaded.set(true);
    } catch (cause) {
      if (cause instanceof HttpErrorResponse) {
        this.error.set(
          cause.status === 0
            ? 'No se pudo conectar con la API. Revisa tu conexión e inténtalo de nuevo.'
            : cause.status >= 200 && cause.status < 300
              ? 'La API devolvió una respuesta que no es JSON válido.'
              : `No se pudieron cargar los usuarios (HTTP ${cause.status}).`,
        );
      } else {
        this.error.set(cause instanceof Error ? cause.message : 'No se pudieron cargar los usuarios.');
      }
    } finally {
      this.loading.set(false);
    }
  }

  async ensureLoaded(): Promise<void> {
    if (!this.loaded()) await this.load();
  }

  toggleFavorite(id: number): void {
    if (!this.users().some((user) => user.id === id)) return;
    this.favoriteIds.update((ids) =>
      ids.includes(id) ? ids.filter((favoriteId) => favoriteId !== id) : [...ids, id],
    );
  }
}
