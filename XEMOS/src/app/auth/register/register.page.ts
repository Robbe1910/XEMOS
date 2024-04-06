import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as bcrypt from 'bcryptjs'; // Importa bcrypt

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registroForm: FormGroup;
  hidePassword: boolean = true;
  errorMessage: string = '';

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router) {
    this.registroForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.registroForm.controls['email'].valueChanges.pipe(
      debounceTime(500), // Agrega un retraso antes de realizar la solicitud HTTP para evitar solicitudes excesivas
      distinctUntilChanged(), // Verifica si el valor ha cambiado desde la última vez
      switchMap(email => this.checkEmailExists(email))
    ).subscribe(response => {
      if (response.exists) {
        this.registroForm.controls['email'].setErrors({ 'alreadyExists': true });
      }
    });
  }
  
  checkEmailExists(email: string): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(`http://localhost:3000/users/checkEmail/${email}`);
  }

  onSubmit() {
    if (this.registroForm.valid) {
      const newUser = {
        fullName: this.registroForm.value.fullName,
        email: this.registroForm.value.email,
        password: bcrypt.hashSync(this.registroForm.value.password, 10) // Cifra la contraseña antes de guardarla
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
          this.router.navigateByUrl('/home'); // Redirige a la ruta '/home'
        }, error => {
          console.error('Error al guardar el usuario:', error);
          this.errorMessage = "Error inesperado. Por favor, inténtalo de nuevo más tarde.";
        });
    } else {
      console.error('Formulario inválido');
      this.errorMessage = "El correo o la contraseña no son válidos";
    }
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

}
