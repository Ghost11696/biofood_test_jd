import { Component } from '@angular/core';
import { TokenStorageService } from './token-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  isLoggedIn = false;
  id?: number;

  constructor(private tokenStorage: TokenStorageService) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorage.getToken();

    if (this.isLoggedIn) {
      this.id = this.tokenStorage.getId();
    }
  }

  logout(): void {
    this.tokenStorage.signOut();
    window.location.reload();
  }
}
