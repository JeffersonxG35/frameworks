import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { App } from './app';
import { UserService } from './services/user.service';

describe('App', () => {
  it('muestra el encabezado de la aplicación', async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const header = (fixture.nativeElement as HTMLElement).querySelector('.app-header');
    expect(header?.textContent).toContain('Usuarios');
    expect(header?.textContent).toContain('Angular');

    const service = TestBed.inject(UserService);
    service.users.set([{ id: 1, name: 'Ana', email: 'ana@example.test', address: { city: 'Cuenca' } }]);
    service.toggleFavorite(1);
    await fixture.whenStable();
    expect(header?.textContent).toContain('Favoritos: 1');
  });
});
