import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { User } from '../model/user';
import { usersService } from './home.service';
import { AuthService } from '../auth.service';
import { TokenStorageService } from '../token-storage.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  providers: [usersService]
})
export class HomeComponent implements OnInit {
  users: User[] = [];
  editUser: User | undefined; // the user currently being edited
  firstname = '';
  lastname = '';
  usersearchterm = '';
  isSuccessful = false;
  isSignUpFailed = false;
  isLoggedIn = false;
  errorMessage = '';
  userForm!: FormGroup;
  id!: number;

  constructor(private homeServices: usersService, private authService: AuthService, private tokenStorage: TokenStorageService, private router: Router) { }

  @ViewChild('userEditInput')
  set userEditInput(element: ElementRef<HTMLInputElement>) {
    if (element) {
      element.nativeElement.focus();
    }
  }

  ngOnInit() {
    this.isLoggedIn = !!this.tokenStorage.getToken();
    if (this.isLoggedIn) {
      this.getUsers();
      this.id = this.tokenStorage.getId();
    }
    
    this.userForm = new FormGroup({
      fname: new FormControl(this.firstname, [
        Validators.required,
        Validators.minLength(4)
      ]),
      lname: new FormControl(this.lastname, [
        Validators.required,
        Validators.minLength(4)
      ])

    })
  }

  getUsers(): void {
    this.homeServices.getUsers()
      .subscribe((users) => (this.users = users));
  }

  delete(user: User): void {    
    this.users = this.users.filter((h) => h !== user);
    this.homeServices.deleteUser(user.id).subscribe();
    if (user.id == this.id) {
      this.tokenStorage.signOut();
    }
  }

  search(searchTerm: string) {
    this.editUser = undefined;
    if (searchTerm) {
      this.homeServices
        .searchUsers(searchTerm)
        .subscribe(users => (this.users = users));
    } else {
      this.getUsers();
    }
  }

  onSubmit(): void {
    let newUser = { firstname: this.firstname, lastname: this.lastname } as User;
    this.authService.register(newUser).subscribe(
      data => {
        if (this.isLoggedIn) {
          this.getUsers();
        } else {
          this.isSuccessful = true;
          this.isSignUpFailed = false;
        }
      },
      err => {
        this.errorMessage = err.error;
        this.isSignUpFailed = true;
      }
    );
  }

  get fname() { return this.userForm.get('fname')!; }

  get lname() { return this.userForm.get('lname')!; }

  update(user: User) {
    //if (firstname && this.editUser && (this.editUser.firstname !== this.userfirstname)) {
    //  this.usersService
    //    .updateUser({ ...this.editUser,firstname})
    //    .subscribe(user => {
    //    // replace the hero in the users list with update from server
    //      const ix = user ? this.users.findIndex(h => h.firstname === firstname) : -1;
    //    if (ix > -1) {
    //      this.users[ix] = user;
    //    }
    //  });
    //  this.editUser = undefined;
    //}
  }
}
