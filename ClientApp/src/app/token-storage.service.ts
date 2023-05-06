import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const USER_ID = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  constructor() { }

  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_ID);
    window.sessionStorage.setItem(USER_ID, JSON.stringify(user));
  }

  public getId(): any {
    const user = window.sessionStorage.getItem(USER_ID);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }
}

