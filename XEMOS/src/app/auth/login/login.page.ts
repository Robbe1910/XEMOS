import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  hidePassword: boolean = true;
  errorMessage: string = '';

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router) {
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

      // Simulación de autenticación con un archivo JSON
      this.http.get<any>('http://localhost:3000/users').subscribe(
        (users: any[]) => {
          const user = users.find(u => u.email === credentials.email && u.password === credentials.password);
          if (user) {
            // Usuario autenticado correctamente
            console.log('Usuario autenticado correctamente');
            this.router.navigateByUrl('/home'); // Redirige al usuario a la página de inicio
          } else {
            // Credenciales inválidas
            this.errorMessage = 'Credenciales inválidas. Por favor, inténtalo de nuevo.';
          }
        },
        error => {
          console.error('Error al cargar usuarios:', error);
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
