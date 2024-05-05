import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: any;
  emailForm: FormGroup;
  passwordForm: FormGroup;
  emergencyForm: FormGroup;
  errorMessage: String = '';
  emailExists: boolean = false;
  confirmDelete: boolean = false;
  hidePassword: boolean = true;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) {
    this.emailForm = this.formBuilder.group({
      newEmail: ['', [Validators.required, Validators.email]],
    });

    this.passwordForm = this.formBuilder.group({
      newPassword: ['', [Validators.required, Validators.minLength(8), this.passwordValidator()]],
    });

    this.emergencyForm = this.formBuilder.group({
      emergencyNumber: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]]
    });
  }

  async ngOnInit() {
    this.user = this.authService.getCurrentUser();
    try {
      const emergencyNumber = await this.authService.getEmergencyNumber(this.user.email).toPromise();
      this.user.emergencyNumber = emergencyNumber;
      console.log('Emergency number:', emergencyNumber);
    } catch (error) {
      console.error('Error obtaining emergency number:', error);
    }
  }
  

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  // Función para actualizar el correo electrónico
  updateEmail() {
    const newEmail = this.emailForm.get('newEmail')?.value;
    const email = this.user.email;

    // Verificar si el correo electrónico ya existe en el backend antes de enviar la solicitud
    this.userService.checkEmailExists(newEmail).subscribe(
      (response: any) => {
        if (response.exists) {
          // Si el correo electrónico ya existe, establece emailExists en true
          this.emailExists = true;
        } else {
          // Si el correo electrónico no existe, realiza la actualización
          this.userService.updateEmail(email, newEmail).subscribe(
            (res: any) => {
              // Actualizar la información del usuario después de la actualización
              this.user.email = newEmail;
              // Limpiar el formulario
              this.emailForm.reset();
              // Establecer emailExists en false en caso de éxito
              this.emailExists = false;
            },
            (err: any) => {
              this.errorMessage = "Error updating email"; // Mensaje de error genérico
            }
          );
        }
      },
      (error: any) => {
        this.errorMessage = "Error checking email"; // Mensaje de error genérico
      }
    );
  }

  // Función de validación personalizada para verificar la complejidad de la contraseña
  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value: string = control.value;
      const hasUppercase = /[A-Z]/.test(value); // Verifica si hay al menos una mayúscula
      const hasLowercase = /[a-z]/.test(value); // Verifica si hay al menos una minúscula
      const hasNumber = /\d/.test(value); // Verifica si hay al menos un número
      const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value); // Verifica si hay al menos un símbolo especial

      const valid = hasUppercase && hasLowercase && hasNumber && hasSpecial;

      return valid ? null : { 'passwordRequirements': true };
    };
  }

  updatePassword() {
    const newPassword = this.passwordForm?.get('newPassword')?.value;
    if (!newPassword) return; // Verificar si newPassword es null o undefined
    const email = this.user.email;
    const password = ''; // Deberías obtener la contraseña actual del usuario
    this.userService.updatePassword(email, password, newPassword).subscribe(
      (res: any) => {
        // Limpiar el valor del input
        this.passwordForm.reset();
      },
      (err: any) => {
      }
    );
  }

  async setNumberEmergency() {
    if (this.emergencyForm.valid) {
      const newEmergencyNumber = this.emergencyForm.value.emergencyNumber;
  
      // Verificar si el número de emergencia nuevo es diferente del actual
      if (newEmergencyNumber !== this.user.emergencyNumber) {
        // Realizar la verificación en el backend antes de enviar la solicitud
        this.userService.checkEmergencyNumberExists(this.user.email, newEmergencyNumber).subscribe(
          async (response: any) => {
            if (response.exists) {
              // Si el número de emergencia ya existe, establecer una bandera para mostrar un mensaje de error
              this.errorMessage = "El número de emergencia ya está registrado.";
            } else {
              // Si el número de emergencia no existe, realizar la actualización
              this.userService.setEmergencyNumber(this.user.email, newEmergencyNumber).subscribe(
                async (res: any) => {
                  // Actualizar la información del usuario después de la actualización
                  this.user.emergencyNumber = newEmergencyNumber;
                  // Limpiar el formulario
                  this.emergencyForm.reset();
                  // Reiniciar el mensaje de error
                  this.errorMessage = '';
                },
                (err: any) => {
                  this.errorMessage = "Error al actualizar el número de emergencia"; // Mensaje de error genérico
                }
              );
            }
          },
          (error: any) => {
            this.errorMessage = "Error al verificar el número de emergencia"; // Mensaje de error genérico
          }
        );
      } else {
        // Si el número de emergencia es el mismo que el actual, no se realiza ninguna acción
        this.errorMessage = "El número de emergencia no ha cambiado.";
      }
    }
  }
  
  

  deleteAccount() {
    this.confirmDelete = true;
  }

  confirmDeleteAccount() {
    const email = this.user.email;
    this.userService.deleteUser(email).subscribe(
      () => {

        this.authService.logout(); // También cerramos sesión si eliminamos la cuenta
        this.router.navigateByUrl('/loading-delete-account'); // Redirigimos a la página de inicio de sesión
      },
      error => {
        this.errorMessage = 'Error deleting account. Please try again later.';
      }
    );
  }

  cancelDelete() {
    this.confirmDelete = false; // Oculta el mensaje de confirmación
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
