import { Component } from '@angular/core';
import { Api } from '../service/api';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PopupComponent } from '../popup/popup';
import {ChangeDetectorRef} from '@angular/core';
import { LoginData } from './loginobj';
import { SecureLs } from '../secure-ls';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule,PopupComponent],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {


  constructor( private router: Router,private cdr: ChangeDetectorRef,private api: Api,private secureLs: SecureLs) {
    
  }

  loginData: LoginData = {
    login: '',
    password: '',
   
};
showPopup = false;
popupMessage = '';
redirectPath: string | null = null;
isLoading = false;
  
ngOnInit(): void {
  this.secureLs.clear();
}

onLogin() {
  if (!this.loginData.login || !this.loginData.password) {
    return;
  }

const payload: {
  password: string;
  email?: string;
  username?: string;
} = {
  password: this.loginData.password
};

if (this.loginData.login.includes('@')) {
  payload.email = this.loginData.login;
} else {
  payload.username = this.loginData.login;
}


  this.isLoading = true;

  this.api.login(payload).subscribe({
    next: (res) => {
      this.isLoading = false;
      this.secureLs.set('token', res.token);
      this.secureLs.set('user', res.user);
      console.log(this.secureLs.get('token'));
      console.log(this.secureLs.get('user'));
      
      // Redirect immediately to dashboard after successful login
      this.router.navigate(['/dashboard']);
    },
    error: (err) => {
      this.isLoading = false;
      this.popupMessage =
        err?.error?.message || 'Something went wrong ❌';
      this.redirectPath = null;
      this.showPopup = true;
      this.cdr.detectChanges();
    }
  });
}



  onSubmit() {
    
  }

 

  goToRegister() {
    this.router.navigate(['/register']);
  }
  closePopup() {
  this.showPopup = false;
  this.cdr.detectChanges();
}
}
