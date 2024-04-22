import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.page.html',
  styleUrls: ['./email-confirmation.page.scss'],
})
export class EmailConfirmationPage implements OnInit {
  confirmationForm!: FormGroup;
  emailExists: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.confirmationForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });

    // Escuchar los cambios en el input de email y verificar si el email existe
    this.confirmationForm.controls['email'].valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(email => this.checkEmailExists(email))
    ).subscribe(response => {
      this.emailExists = response;
    });
  }

  sendConfirmationEmail(): void {
    if (this.confirmationForm.valid && this.emailExists) {
      const email = this.confirmationForm.value.email;
      this.authService.requestChangePassword(email).subscribe(
        (response) => {
          console.log(response);
          // Mostrar mensaje de éxito o redirigir si es necesario
        },
        (error) => {
          console.error('Error sending confirmation email:', error);
          // Manejar el error según sea necesario
        }
      );
    } else {
      console.error('Invalid form or email already exists');
      // Mostrar un mensaje de error o manejar la situación de falta de correo electrónico válido
    }
  }

  confirmEmail(): void {
    const email = this.confirmationForm.value.email;
    this.authService.checkEmailPasswordConfirmed(email).subscribe(
      (response) => {
        console.log(response)
        if (response.passwordChangeRequested) {
          // Redirigir a password-change si el correo electrónico está confirmado
          this.router.navigateByUrl('/change-password');
        } else {
          // Mostrar un mensaje de error si el correo electrónico no está confirmado
          console.log('El correo electrónico aún no ha sido confirmado.');
        }
      },
      (error) => {
        console.error('Error checking email confirmation:', error);
        // Redirige a login u otra página si hay un error al verificar la confirmación del correo electrónico
        this.router.navigateByUrl('/login');
      }
    );
  }

  checkEmail() {
    const emailControl = this.confirmationForm.get('email');
    if (emailControl && emailControl.value) {
      this.checkEmailExists(emailControl.value)
        .pipe(
          map(response => {
            return response ? { emailExists: true } : null;
          })
        )
        .subscribe(result => {
          if (result) {
            emailControl.setErrors(result);
          } else {
            emailControl.setErrors(null);
          }
        });
    }
  }

  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<{ exists: boolean }>(`http://34.175.187.252:3000/checkEmail/${email}`).pipe(
      map(response => response.exists) // Transformar la respuesta para que solo devuelva el valor booleano
    );
  }
}
