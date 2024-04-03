import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registroForm: FormGroup;
  hidePassword: boolean = true;
  errorMessage: string = '';

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {
    this.registroForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    if (this.registroForm.valid) {
      const newUser = {
        fullName: this.registroForm.value.fullName,
        email: this.registroForm.value.email,
        password: this.registroForm.value.password
      };

      this.http.post<any>('http://localhost:3000/users', newUser)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 400) {
              this.errorMessage = error.error.message; // Mensaje de error del servidor
            } else {
              this.errorMessage = 'Error inesperado. Por favor, inténtalo de nuevo más tarde.';
            }
            return throwError(this.errorMessage); // Propaga el error para que pueda ser manejado por el suscriptor
          })
        )
        .subscribe(() => {
          console.log('Usuario registrado correctamente');
          // Aquí podrías redirigir al usuario a otra página o mostrar un mensaje de éxito
        }, error => {
          console.error('Error al guardar el usuario:', error);
          // Aquí podrías mostrar un mensaje de error al usuario
        });
    } else {
      console.error('Formulario inválido');
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

}
