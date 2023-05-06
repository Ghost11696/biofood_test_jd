import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientXsrfModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AuthService } from './auth.service';
import { HomeComponent } from './home/home.component';
import { HttpErrorHandler } from './http-error-handler.service';
import { MessageService } from './message.service';

import { authInterceptorProviders } from './_helpers/auth.interceptor';
import { LoginComponent } from './login/login.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'My-Xsrf-Cookie',
      headerName: 'My-Xsrf-Header',
    }),
    
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent
  ],
  providers: [
    AuthService,
    authInterceptorProviders,
    HttpErrorHandler,
    MessageService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
