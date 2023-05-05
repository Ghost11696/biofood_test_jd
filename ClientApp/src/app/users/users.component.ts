import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { User } from './user';
import { usersService } from './users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  providers: [usersService]
})
export class usersComponent implements OnInit {
  users: User[] = [];
  editUser: User | undefined; // the user currently being edited
  userfirstname = '';
  userlastname = '';
  usersearchterm = '';
  userForm! : FormGroup;

  constructor(private usersService: usersService) {}

  @ViewChild('userEditInput')
  set userEditInput(element: ElementRef<HTMLInputElement>) {
    if (element) {
      element.nativeElement.focus();
    }
  }

  ngOnInit() {
    this.getUsers();
    this.userForm = new FormGroup({
      fname: new FormControl(this.userfirstname, [
        Validators.required,
        Validators.minLength(4)
      ]),
      lname: new FormControl(this.userlastname, [
        Validators.required,
        Validators.minLength(4)
      ])

    })
  }

  getUsers(): void {
    this.usersService.getUsers()
      .subscribe((users) => (this.users = users));
  }

  add(firstname: string, lastname: string): void {
    this.editUser = undefined;
    const newUser: User = { firstname, lastname } as User;
    this.usersService.addUser(newUser).subscribe();
    this.users.push(newUser);
  }

  delete(user: User): void {
    this.users = this.users.filter((h) => h !== user);
    this.usersService.deleteUser(user.id).subscribe();
  }

  search(searchTerm: string) {
    this.editUser = undefined;
    if (searchTerm) {
      this.usersService
        .searchUsers(searchTerm)
        .subscribe(users => (this.users = users));
    } else {
      this.getUsers();
    }
  }

  onSubmit(): void {
    debugger;
    this.add(this.userfirstname, this.userlastname);
  }

  get fname() { return this.userForm.get('fname')!; }

  get lname() { return this.userForm.get('lname')!; }

  //edit(firstname: string) {
  //  this.update(firstname);
  //  this.editUser = undefined;
  //}

  //update(firstname: string) {
  //  if (firstname && this.editUser && (this.editUser.firstname !== this.userfirstname)) {
  //    this.usersService
  //      .updateUser({ ...this.editUser,firstname})
  //      .subscribe(user => {
  //      // replace the hero in the users list with update from server
  //        const ix = user ? this.users.findIndex(h => h.firstname === firstname) : -1;
  //      if (ix > -1) {
  //        this.users[ix] = user;
  //      }
  //    });
  //    this.editUser = undefined;
  //  }
  //}
}
