import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.page.html',
  styleUrls: ['./confirm-email.page.scss'],
})
export class ConfirmEmailPage implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    // Verificar si el correo electrónico está confirmado al cargar el componente
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.emailConfirmed) {
      // Redirigir a confirmation-page si el correo electrónico está confirmado
      this.router.navigateByUrl('/confirmation-page');
    }
  }

  resendConfirmationEmail(): void {
    const currentUser = this.authService.getCurrentUserRegistered();
    console.log(currentUser)
    if (currentUser && currentUser.loginToken) {
      this.authService.resendConfirmationEmail(currentUser.token).subscribe(
        (response) => {
          console.log('Confirmation email resent successfully');
          // Verificar si el correo electrónico ya está confirmado
          const currentUser = this.authService.getCurrentUser();
          if (currentUser && currentUser.emailConfirmed) {
            // Redirigir a confirmation-page si el correo electrónico está confirmado
            this.router.navigateByUrl('/confirmation-page');
          }
        },
        (error) => {
          console.error('Error resending confirmation email:', error);
          // Redirige a login si hay un error al reenviar el correo de confirmación
          this.router.navigateByUrl('/login');
        }
      );
    }
  }
  
  

  confirmEmail(): void {
    this.authService.checkEmailConfirmed().subscribe(
      (response) => {
        console.log(response)
        if (response.emailConfirmed) {
          // Redirigir a confirmation-page si el correo electrónico está confirmado
          this.router.navigateByUrl('/confirmation-page');
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
  

}
