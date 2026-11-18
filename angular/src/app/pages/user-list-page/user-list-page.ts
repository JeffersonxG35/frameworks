import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { UserCard } from '../../components/user-card/user-card';

@Component({
  selector: 'app-user-list-page',
  imports: [FormsModule, UserCard],
  templateUrl: './user-list-page.html',
})
export class UserListPage implements OnInit {
  protected readonly service = inject(UserService);

  ngOnInit(): void {
    void this.service.ensureLoaded();
  }
}
