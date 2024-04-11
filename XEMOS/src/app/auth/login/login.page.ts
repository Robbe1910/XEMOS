import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  hidePassword: boolean = true;
  errorMessage: string = '';

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router, private authService: AuthService) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }
  
  ngOnInit() {
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };
  
      this.authService.login(credentials.email, credentials.password).subscribe(
        success => {
          if (success) {
            console.log('Usuario autenticado correctamente');
            this.router.navigateByUrl('/home'); // Redirige al usuario a la página de inicio
          } else {
            console.error('Error: No se pudo autenticar al usuario');
          }
        },
        error => {
          console.error('Error al intentar iniciar sesión:', error);
          this.errorMessage = 'Error inesperado. Por favor, inténtalo de nuevo más tarde.';
        }
      );
    } else {
      console.error('Formulario inválido');
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
    }
  }
  

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

}
