import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Api } from '../service/api';
import { Router, RouterLink } from '@angular/router';
import { PopupComponent } from '../popup/popup';
import {ChangeDetectorRef} from '@angular/core';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule,PopupComponent,RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  user = {
    name: '',
    username: '',
    email: '',
    password: '',
  };

showPopup = false;
popupMessage = '';
redirectPath: string | null = null;

  isLoading = false;

  constructor(private api: Api,private router:Router,private cdr: ChangeDetectorRef) {}



onSubmit() {
  if (this.isLoading) return;
  if(!this.user.name || !this.user.username || !this.user.email || !this.user.password){
    this.popupMessage = 'All fields are required';
    this.showPopup = true;
    this.cdr.detectChanges();
    return;
  }

 if (this.user.password.length < 6) {
  this.popupMessage = 'Password must be at least 6 characters long';
  this.redirectPath = null;
  this.showPopup = true;
  return;
}


  this.isLoading = true;

  this.api.createaccount(this.user).subscribe({
    next: (res) => {
      this.isLoading = false;
      this.popupMessage = 'Account created successfully 🎉';
      this.redirectPath = '/login';
      this.showPopup = true;
      this.cdr.detectChanges();
    },
    error: (err) => {
      this.isLoading = false;
      this.popupMessage =
    err?.error?.message || 'Something went wrong ❌';
      this.redirectPath = null;
      this.showPopup = true;
      this.user.username = '';
      this.user.email = '';
      this.user.password = '';
      this.user.name = '';
      this.cdr.detectChanges();
    }
  });
}

closePopup() {
  this.showPopup = false;
  this.cdr.detectChanges();
}


}
