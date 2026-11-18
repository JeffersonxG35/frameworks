import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User } from '../user.model';

const URL = 'https://jsonplaceholder.typicode.com/users';
const sample: User[] = [
  { id: 1, name: 'Ana Pérez', email: 'ana@example.test', address: { city: 'Cuenca' } },
  { id: 2, name: 'Luis Mora', email: 'luis@example.test', address: { city: 'Quito' } },
];

describe('UserService', () => {
  let service: UserService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(UserService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('consulta con GET y actualiza los estados de carga', async () => {
    const pending = service.load();
    expect(service.loading()).toBe(true);
    const request = http.expectOne(URL);
    expect(request.request.method).toBe('GET');
    request.flush(sample);
    await pending;
    expect(service.users()).toEqual(sample);
    expect(service.loading()).toBe(false);
    expect(service.error()).toBeNull();
    expect(service.loaded()).toBe(true);
  });

  it('permite reintentar una consulta HTTP fallida', async () => {
    const failed = service.load();
    http.expectOne(URL).flush('Error', { status: 500, statusText: 'Server Error' });
    await failed;
    expect(service.error()).toContain('HTTP 500');
    expect(service.loading()).toBe(false);
    expect(service.loaded()).toBe(false);

    const retry = service.load();
    http.expectOne(URL).flush(sample);
    await retry;
    expect(service.error()).toBeNull();
    expect(service.users()).toEqual(sample);
  });

  it('rechaza datos que no tienen formato de usuario', async () => {
    const pending = service.load();
    http.expectOne(URL).flush([{ title: 'Tarea' }]);
    await pending;
    expect(service.error()).toContain('formato inesperado');
    expect(service.users()).toEqual([]);
  });

  it('filtra por nombre sin distinguir mayúsculas y espacios exteriores', () => {
    service.users.set(sample);
    service.query.set('  ANA  ');
    expect(service.filteredUsers()).toEqual([sample[0]]);
    service.query.set('inexistente');
    expect(service.filteredUsers()).toEqual([]);
    service.query.set('');
    expect(service.filteredUsers()).toEqual(sample);
  });

  it('actualiza favoritos y conserva su contador al filtrar', () => {
    service.users.set(sample);
    service.toggleFavorite(1);
    service.query.set('Luis');
    expect(service.favoriteCount()).toBe(1);
    expect(service.filteredUsers()).toEqual([sample[1]]);
    service.toggleFavorite(1);
    service.toggleFavorite(999);
    expect(service.favoriteCount()).toBe(0);
  });

  it('evita volver a consultar al regresar del detalle', async () => {
    const first = service.ensureLoaded();
    http.expectOne(URL).flush(sample);
    await first;
    await service.ensureLoaded();
    http.expectNone(URL);
  });

  it('muestra un mensaje comprensible si no hay conexión', async () => {
    const pending = service.load();
    http.expectOne(URL).error(new ProgressEvent('error'));
    await pending;
    expect(service.error()).toContain('No se pudo conectar');
    expect(service.loading()).toBe(false);
  });
});
