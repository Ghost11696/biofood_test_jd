import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { User } from './user';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    Authorization: 'auth-token'
  })
};

@Injectable()
export class usersService {
  usersGetUrl = 'user/get';  // URL to web api
  usersPostUrl = 'user/post';
  usersDeleteUrl = 'user/delete';
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('usersService');
  }

  /** GET users from the server */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersGetUrl)
      .pipe(
        catchError(this.handleError('getusers', []))
      );
  }

  /* GET users whose name contains search term */
  searchUsers(term: string): Observable<User[]> {
    term = term.trim();

    const url = `${this.usersGetUrl}?searchterm=${term}`;

    return this.http.get<User[]>(url)
      .pipe(
        catchError(this.handleError<User[]>('searchusers', []))
      );
  }

  /** POST: */
  addUser(user: User): Observable<User> {
    httpOptions.headers =
      httpOptions.headers.set('Authorization', 'auth-token');

    return this.http.post<User>(this.usersPostUrl, user, httpOptions)
      .pipe(
        catchError(this.handleError('addUser', user))
      );
  }

  /** DELETE: */
  deleteUser(id: number): Observable<unknown> {
    const url = `${this.usersDeleteUrl}?id=${id}`;
    return this.http.delete(url, httpOptions)
      .pipe(
        catchError(this.handleError('deleteUser'))
      );
  }

  /** PUT: */
  updateUser(user: User): Observable<User> {
    httpOptions.headers =
      httpOptions.headers.set('Authorization', 'my-new-auth-token');

    return this.http.put<User>(this.usersPostUrl, user, httpOptions)
      .pipe(
        catchError(this.handleError('updateUser', user))
      );
  }
}
