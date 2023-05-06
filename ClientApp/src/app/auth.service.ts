import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './model/user';

const AUTH_API = 'user/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  login(user: User): Observable<any> {
    return this.http.post(AUTH_API + 'signin', user, httpOptions);
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(AUTH_API + 'signup', user, httpOptions);
  }
}
