import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage{

  loginForm: FormGroup;
  hidePassword: boolean = true;
  errorMessage: string = '';

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router, private authService: AuthService) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      const credentials = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      this.authService.login(credentials.email, credentials.password).subscribe(
        success => {
          if (!success.emailConfirmed) {
            this.router.navigateByUrl('/confirm-email');
          } else {
            this.router.navigateByUrl('/loading-login');
          }
        },
        error => {
          if (error.status === 401) {
            this.errorMessage = 'Incorrect email or password.';
          } else {
            this.errorMessage = 'Server error. Please try again later.';
          }
        }
      );
      
    } else {
      this.errorMessage = 'Please fill in all fields correctly.';
    }
  }
  
  

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

}
