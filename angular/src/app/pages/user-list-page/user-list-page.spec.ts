import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UserListPage } from './user-list-page';

const URL = 'https://jsonplaceholder.typicode.com/users';
const sample = [
  { id: 1, name: 'Ana Pérez', email: 'ana@example.test', address: { city: 'Cuenca' } },
  { id: 2, name: 'Luis Mora', email: 'luis@example.test', address: { city: 'Quito' } },
];

describe('UserListPage', () => {
  let fixture: ComponentFixture<UserListPage>;
  let http: HttpTestingController;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserListPage],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    fixture = TestBed.createComponent(UserListPage);
    http = TestBed.inject(HttpTestingController);
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  it('filtra las tarjetas mientras se escribe en la búsqueda', async () => {
    http.expectOne(URL).flush(sample);
    await fixture.whenStable();
    const input = element.querySelector('input')!;
    input.value = '  LUIS  ';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    const cards = element.querySelectorAll('article');
    expect(cards).toHaveLength(1);
    expect(cards[0].textContent).toContain('Luis Mora');
  });

  it('muestra el error y recupera las tarjetas con Reintentar', async () => {
    http.expectOne(URL).flush('Error', { status: 500, statusText: 'Server Error' });
    await fixture.whenStable();
    expect(element.querySelector('[role="alert"]')?.textContent).toContain('HTTP 500');
    element.querySelector('button')!.click();
    http.expectOne(URL).flush(sample);
    await fixture.whenStable();
    expect(element.querySelector('[role="alert"]')).toBeNull();
    expect(element.querySelectorAll('article')).toHaveLength(2);
  });

  it('informa cuando la API devuelve una lista vacía', async () => {
    http.expectOne(URL).flush([]);
    await fixture.whenStable();
    expect(element.textContent).toContain('La API no devolvió usuarios.');
  });
});
