import { Routes } from '@angular/router';
import { UserListPage } from './pages/user-list-page/user-list-page';
import { UserDetailPage } from './pages/user-detail-page/user-detail-page';

export const routes: Routes = [
  { path: '', component: UserListPage, title: 'Directorio de usuarios | Angular' },
  { path: 'users/:id', component: UserDetailPage, title: 'Detalle del usuario | Angular' },
  { path: '**', redirectTo: '' },
];
