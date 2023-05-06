import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { TokenStorageService } from '../token-storage.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../model/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  isLoggedIn = false;
  isLoginFailed = false;
  firstname = '';
  lastname = '';

  errorMessage = '';
  loginForm!: FormGroup;

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private router: Router) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
    }

    this.loginForm = new FormGroup({
      fname: new FormControl(this.firstname, [
        Validators.required,
        Validators.minLength(4)
      ]),
      lname: new FormControl(this.lastname, [
        Validators.required,
        Validators.minLength(4)
      ])

    });
  }

  onSubmit(): void {
    let loginUser = { firstname: this.firstname, lastname: this.lastname } as User;

    this.authService.login(loginUser).subscribe(
      data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data.authUser);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.router.navigate(['/', 'home']);
      },
      err => {
        this.errorMessage = err.error;
        this.isLoginFailed = true;
      }
    );
  }

  get fname() { return this.loginForm.get('fname')!; }

  get lname() { return this.loginForm.get('lname')!; }
}
