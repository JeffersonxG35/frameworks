import { Component, OnInit, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-detail-page',
  imports: [RouterLink],
  templateUrl: './user-detail-page.html',
})
export class UserDetailPage implements OnInit {
  protected readonly service = inject(UserService);
  readonly id = input.required<string>();
  protected readonly user = computed(() =>
    this.service.users().find((user) => String(user.id) === this.id()),
  );

  ngOnInit(): void {
    void this.service.ensureLoaded();
  }
}
