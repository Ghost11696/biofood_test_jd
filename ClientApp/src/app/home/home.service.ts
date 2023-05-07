import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { User } from '../model/user';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';

@Injectable()
export class usersService {
  usersGetUrl = 'user/get'; 
  usersDeleteUrl = 'user/delete';
  usersPutUrl = 'user/put';
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('homeService');
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

  /** DELETE: */
  deleteUser(id: number): Observable<unknown> {
    const url = `${this.usersDeleteUrl}?id=${id}`;
    return this.http.delete(url)
      .pipe(
        catchError(
          this.handleError('deleteUser'))
      );
  }

  /** PUT: */
  updateUser(user: User): Observable<User> {
    return this.http.put<User>(this.usersPutUrl, user)
      .pipe(
        catchError(this.handleError('updateUser', user))
      );
  }
}
