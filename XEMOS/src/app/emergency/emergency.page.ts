import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { Plugins, Capacitor } from '@capacitor/core';

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
        // Verificar si la plataforma es Android y si los permisos de llamada están disponibles
        if (Capacitor.isNative && Capacitor.getPlatform() === 'android') {
          Plugins['Permissions']['requestPermission']('CALL_PHONE').then((result: any) => {
            if (result.state === 'granted') {
              // Se concedieron los permisos, realizar la llamada
              window.location.href = 'tel:' + emergencyNumber;
            } else {
              console.error('No se otorgaron los permisos para realizar llamadas.');
            }
          });
        } else {
          // En otras plataformas o si los permisos no son necesarios, realizar la llamada directamente
          window.location.href = 'tel:' + emergencyNumber;
        }
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
