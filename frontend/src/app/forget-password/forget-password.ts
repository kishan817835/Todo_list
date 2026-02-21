import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PopupComponent } from '../popup/popup';
import { ChangeDetectorRef } from '@angular/core';
import { Api } from '../service/api';

@Component({
  selector: 'app-forget-password',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PopupComponent],
  templateUrl: './forget-password.html',
  styleUrl: './forget-password.css',
})
export class ForgetPassword implements OnDestroy {
  selectedOption: 'current' | 'otp' = 'current';
  isLoading = false;
  showPopup = false;
  popupMessage = '';
  redirectPath: string | null = null;
  
  // Timer for OTP button
  otpTimer: any = null;
  remainingTime = 0;
  isOtpButtonDisabled = false;
  otpAttempts = 0;
  maxOtpAttempts = 3;

  // Form for current password change
  currentPasswordForm: FormGroup;

  // Form for OTP password change
  otpForm: FormGroup;
  otpSent = false;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private api: Api,
    private fb: FormBuilder
  ) {
    this.currentPasswordForm = this.fb.group({
      identifier: ['', [Validators.required]], // Combined field for email or username
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });

    this.otpForm = this.fb.group({
      identifier: ['', [Validators.required]], // Combined field for email or username
      otp: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  selectOption(option: 'current' | 'otp') {
    this.selectedOption = option;
  }

  // Start 5 minute timer for OTP button
  startOtpTimer() {
    this.isOtpButtonDisabled = true;
    this.remainingTime = 300; // 5 minutes in seconds
    
    this.otpTimer = setInterval(() => {
      this.remainingTime--;
      if (this.remainingTime <= 0) {
        clearInterval(this.otpTimer);
        this.isOtpButtonDisabled = false;
        this.remainingTime = 0;
        // Don't reset attempts here - only reset when new OTP is sent or max attempts reached
      }
      this.cdr.detectChanges();
    }, 1000);
  }

  // Format time display
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  // Change password with current password
  async onChangeCurrentPassword() {
    if (this.currentPasswordForm.invalid) {
      this.popupMessage = 'Please fill all fields correctly';
      this.showPopup = true;
      this.cdr.detectChanges();
      return;
    }

    const { identifier, currentPassword, newPassword, confirmPassword } = this.currentPasswordForm.value;

    if (newPassword !== confirmPassword) {
      this.popupMessage = 'New passwords do not match';
      this.showPopup = true;
      this.cdr.detectChanges();
      return;
    }

    // Check if identifier is email or username
    const isEmail = identifier.includes('@');
    const payload: any = {
      password: currentPassword,
      newpassword: newPassword
    };

    if (isEmail) {
      payload.useremail = identifier; // Send as email
    } else {
      payload.username = identifier; // Send as username
    }

    this.isLoading = true;

    try {
      const response = await this.api.changePasswordWithCurrent(payload).toPromise();

      this.isLoading = false;
      this.popupMessage = 'Password changed successfully!';
      this.redirectPath = '/login';
      this.showPopup = true;
      this.cdr.detectChanges();
    } catch (error: any) {
      this.isLoading = false;
      this.popupMessage = error?.error?.message || 'Failed to change password';
      this.showPopup = true;
      this.cdr.detectChanges();
    }
  }

  // Send OTP
  async onSendOtp() {
    const identifier = this.otpForm.get('identifier')?.value;
    
    if (!identifier) {
      this.popupMessage = 'Please enter your email address or username';
      this.showPopup = true;
      this.cdr.detectChanges();
      return;
    }

    this.isLoading = true;

    // Check if identifier is email or username
    const isEmail = identifier.includes('@');
    const payload: any = {};

    if (isEmail) {
      payload.email = identifier; // Send as email
    } else {
      // For username, we need to find the user's email first
      // For now, we'll send OTP with identifier as email
      payload.email = identifier;
    }

    try {
      const response = await this.api.sendOtp(payload).toPromise();
      this.otpSent = true;
      this.otpAttempts = 0; // Reset attempts when new OTP is sent
      this.startOtpTimer(); // Start 5-minute timer
      this.popupMessage = 'OTP sent to your email!';
      this.showPopup = true;
      
      // Ensure loader stops after a short delay
      setTimeout(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }, 100);
      
      this.cdr.detectChanges();
    } catch (error: any) {
      this.popupMessage = error?.error?.message || 'Failed to send OTP';
      this.showPopup = true;
      
      // Ensure loader stops after a short delay
      setTimeout(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }, 100);
      
      this.cdr.detectChanges();
    }
  }

  // Change password with OTP
  async onChangePasswordWithOtp() {
    if (this.otpForm.invalid) {
      this.popupMessage = 'Please fill all fields correctly';
      this.showPopup = true;
      this.cdr.detectChanges();
      return;
    }

    const { identifier, otp, newPassword, confirmPassword } = this.otpForm.value;

    if (newPassword !== confirmPassword) {
      this.popupMessage = 'New passwords do not match';
      this.showPopup = true;
      this.cdr.detectChanges();
      return;
    }

    this.isLoading = true;

    try {
      const response = await this.api.changePasswordWithOtp({
        email: identifier, // Send identifier as email (backend will handle both)
        otp,
        newPassword
      }).toPromise();

      this.isLoading = false;
      this.popupMessage = 'Password changed successfully!';
      this.redirectPath = '/login';
      this.showPopup = true;
      this.cdr.detectChanges();
    } catch (error: any) {
      this.isLoading = false;
      
      // Debug logging to see actual error structure
      console.log('Full error object:', error);
      console.log('Error status:', error?.status);
      console.log('Error error:', error?.error);
      console.log('Error message:', error?.error?.message);
      console.log('Error text:', error?.error?.error);
      
      // Handle OTP attempts from backend error message
      let errorMessage = '';
      
      // Try different error message paths
      if (error?.error?.message) {
        errorMessage = error.error.message;
      } else if (error?.error?.error) {
        errorMessage = error.error.error;
      } else if (error?.message) {
        errorMessage = error.message;
      } else {
        errorMessage = 'Failed to change password';
      }
      
      console.log('Final error message:', errorMessage);
      
      // Clean up the error message
      errorMessage = errorMessage.trim();
      
      // Check if error message contains attempt information
      if (errorMessage.toLowerCase().includes('attempts left')) {
        // Extract attempts left from message like "Invalid OTP. Attempts left: 2"
        const attemptsMatch = errorMessage.match(/(\d+)/);
        if (attemptsMatch) {
          const attemptsLeft = parseInt(attemptsMatch[0]);
          this.otpAttempts = this.maxOtpAttempts - attemptsLeft;
          
          if (attemptsLeft === 0) {
            // No attempts left, re-enable send OTP button
            this.isOtpButtonDisabled = false;
            this.otpSent = false;
            this.otpAttempts = 0;
            this.popupMessage = 'Maximum attempts reached. Please request a new OTP.';
          } else {
            this.popupMessage = `Invalid OTP. ${attemptsLeft} attempt${attemptsLeft === 1 ? '' : 's'} left`;
          }
        } else {
          this.popupMessage = errorMessage;
        }
      } else if (errorMessage.toLowerCase().includes('maximum attempts reached') || errorMessage.toLowerCase().includes('otp failed 3 times')) {
        // Maximum attempts reached, re-enable send OTP button
        this.isOtpButtonDisabled = false;
        this.otpSent = false;
        this.otpAttempts = 0;
        this.popupMessage = 'Maximum attempts reached. Please request a new OTP.';
      } else if (errorMessage.toLowerCase().includes('invalid otp')) {
        this.popupMessage = 'Invalid OTP. Please try again.';
      } else if (errorMessage.toLowerCase().includes('otp not found')) {
        this.popupMessage = 'OTP not found. Please request a new OTP.';
      } else if (errorMessage.toLowerCase().includes('otp expired')) {
        this.popupMessage = 'OTP has expired. Please request a new OTP.';
      } else {
        this.popupMessage = errorMessage;
      }
      
      this.showPopup = true;
      this.cdr.detectChanges();
    }
  }

  goBack() {
    this.router.navigate(['/login']);
  }

  closePopup() {
    this.showPopup = false;
    if (this.redirectPath) {
      this.router.navigate([this.redirectPath]);
    }
    this.cdr.detectChanges();
  }

  // Cleanup timer on component destroy
  ngOnDestroy() {
    if (this.otpTimer) {
      clearInterval(this.otpTimer);
    }
  }
}
