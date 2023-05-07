import { Component, OnInit } from '@angular/core';
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
  editfname = '';
  editlname = '';
  usersearchterm = '';
  isSuccessful = false;
  isSignUpFailed = false;
  isLoggedIn = false;
  errorMessage = '';
  userForm!: FormGroup;
  editForm!: FormGroup;
  id!: number;

  constructor(private homeServices: usersService, private authService: AuthService, private tokenStorage: TokenStorageService, private router: Router) { }

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
    });

    this.editForm = new FormGroup({
      id: new FormControl(''),
      efname: new FormControl(this.firstname, [
        Validators.required,
        Validators.minLength(4)
      ]),
      elname: new FormControl(this.lastname, [
        Validators.required,
        Validators.minLength(4)
      ])
    });

  }

  getUsers(): void {
    this.homeServices.getUsers()
      .subscribe((users) => (this.users = users));
  }

  onSelect(user: User): void {
    this.editUser = user;
  }

  delete(user: User): void {    
    this.users = this.users.filter((h) => h !== user);
    this.homeServices.deleteUser(user.id).subscribe();
    if (user.id == this.id) {
      this.tokenStorage.signOut();
      window.location.reload();
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

  get efname() { return this.editForm.get('efname')!; }

  get elname() { return this.editForm.get('elname')!; }

  update(id: number, efname: string, elname: string) {
    this.editUser = { id: id, firstname: efname, lastname: elname }
    this.homeServices.updateUser(this.editUser).subscribe(
      data => {
        this.editUser = undefined;
        this.getUsers();
      });
    }
}
