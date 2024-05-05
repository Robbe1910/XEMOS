import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { OneSignal } from '@ionic-native/onesignal/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(platform: Platform, private oneSignal: OneSignal) {
    platform.ready().then(() => {
      this.oneSignal.startInit("12c88b03-a235-4bc2-a173-e01e81cf622b");
  
      this.oneSignal.handleNotificationOpened().subscribe((jsonData) => {
        console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
      });
  
      // Prompts the user for notification permissions.
      // Since this shows a generic native prompt, we recommend instead using an In-App Message to prompt for notification permission (See step 7) to better communicate to your users what notifications they will get.
      this.oneSignal.endInit();
      
      // Solicitar permiso para las notificaciones
      this.oneSignal.setSubscription(true);
    });
  }
}
