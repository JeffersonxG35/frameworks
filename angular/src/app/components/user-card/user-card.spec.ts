import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { UserCard } from './user-card';

describe('UserCard', () => {
  let fixture: ComponentFixture<UserCard>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCard],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(UserCard);
    fixture.componentRef.setInput('user', {
      id: 7, name: 'Ana Pérez', email: 'ana@example.test', address: { city: 'Cuenca' },
    });
    await fixture.whenStable();
    element = fixture.nativeElement;
  });

  it('muestra nombre, correo y ciudad y enlaza al detalle', () => {
    expect(element.textContent).toContain('Ana Pérez');
    expect(element.textContent).toContain('ana@example.test');
    expect(element.textContent).toContain('Cuenca');
    expect(element.querySelector('a')?.getAttribute('href')).toBe('/users/7');
  });

  it('emite el identificador al pulsar Favorito', () => {
    const spy = vi.fn();
    fixture.componentInstance.favoriteToggled.subscribe(spy);
    element.querySelector('button')!.click();
    expect(spy).toHaveBeenCalledWith(7);
  });

  it('refleja la selección de favorito en el botón', async () => {
    fixture.componentRef.setInput('favorite', true);
    await fixture.whenStable();
    expect(element.querySelector('button')?.getAttribute('aria-pressed')).toBe('true');
    expect(element.querySelector('button')?.textContent).toContain('Quitar favorito');
  });
});
