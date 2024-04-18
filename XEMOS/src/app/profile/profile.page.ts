import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
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
              console.log('Correo electrónico actualizado exitosamente');
              // Actualizar la información del usuario después de la actualización
              this.user.email = newEmail;
              // Limpiar el formulario
              this.emailForm.reset();
              // Establecer emailExists en false en caso de éxito
              this.emailExists = false;
            },
            (err: any) => {
              console.error('Error al actualizar el correo electrónico:', err);
              this.errorMessage = "Error updating email"; // Mensaje de error genérico
            }
          );
        }
      },
      (error: any) => {
        console.error('Error checking email:', error);
        this.errorMessage = "Error checking email"; // Mensaje de error genérico
      }
    );
  }
  
  updatePassword() {
    const newPassword = this.passwordForm?.get('newPassword')?.value;
    if (!newPassword) return; // Verificar si newPassword es null o undefined
    const email = this.user.email;
    const password = ''; // Deberías obtener la contraseña actual del usuario
    this.userService.updatePassword(email, password, newPassword).subscribe(
      (res: any) => {
        console.log('Contraseña actualizada exitosamente');
        // Limpiar el valor del input
        this.passwordForm.reset();
      },
      (err: any) => {
        console.error('Error al actualizar la contraseña:', err);
      }
    );
  }

  deleteAccount() {
    this.confirmDelete = true;
  }

  confirmDeleteAccount() {
    const email = this.user.email;
    this.userService.deleteUser(email).subscribe(
      () => {
        console.log('Account deleted successfully.');
        this.authService.logout(); // También cerramos sesión si eliminamos la cuenta
        this.router.navigateByUrl('/login'); // Redirigimos a la página de inicio de sesión
      },
      error => {
        console.error('Error deleting account:', error);
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
