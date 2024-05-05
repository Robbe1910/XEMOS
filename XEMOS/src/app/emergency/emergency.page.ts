import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-emergency',
  templateUrl: './emergency.page.html',
  styleUrls: ['./emergency.page.scss'],
})
export class EmergencyPage implements OnInit {

  user: any;

  constructor(private userService: UserService, private authService: AuthService) { }

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
  }

  llamarNumeroEmergencia() {
    const email = this.user.email;
    this.userService.getEmergencyNumber(email).subscribe(
      (response: any) => {
        const emergencyNumber = response.emergencyNumber;
        if (emergencyNumber) {
          window.location.href = 'tel:' + emergencyNumber;
        } else {
          console.error('Número de emergencia no encontrado para este usuario');
        }
      },
      (error: any) => {
        console.error('Error al obtener el número de emergencia:', error);
      }
    );
  }

}
