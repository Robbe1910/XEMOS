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
              this.router.navigateByUrl('/loading-login'); // Redirige al usuario a la página de inicio
          },
          error => {
            if (error.status === 401) {
              // 401 Unauthorized indica credenciales incorrectas
              this.errorMessage = 'Incorrect email or password.';
            } else {
              // Otros errores, mostrar mensaje genérico
              this.errorMessage = 'Server error. Please try again later.';
            }
          }
        );
    } else {
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
    }
  }
  

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

}
