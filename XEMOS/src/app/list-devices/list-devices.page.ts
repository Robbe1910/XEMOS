import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

declare var navigator: any;
declare var Connection: any;
declare var WifiWizard2: any;

@Component({
  selector: 'app-list-devices',
  templateUrl: './list-devices.page.html',
  styleUrls: ['./list-devices.page.scss'],
})
export class ListDevicesPage implements OnInit {
  networkType: string = '';
  wifiName: string = '';
  isConnected: boolean = false;

  constructor(private platform: Platform) {}

  ngOnInit() {
    this.platform.ready().then(() => {
      this.checkWifiConnection();
    });
  }

  checkWifiConnection() {
    if (typeof WifiWizard2 !== 'undefined') {
      WifiWizard2.getConnectedSSID().then((ssid: string) => {
        this.wifiName = ssid;
        this.networkType = 'WiFi connection';
        this.isConnected = true;
      }).catch((error: any) => {
        console.error('Error obteniendo el SSID de WiFi:', error);
        this.wifiName = 'Error obteniendo el SSID de WiFi';
        this.networkType = 'No WiFi connection';
        this.isConnected = false;
      });
    } else {
      console.error('WifiWizard2 no está definido. Asegúrate de haber instalado y configurado correctamente el plugin cordova-plugin-wifiwizard2.');
      this.networkType = 'Plugin not available';
      this.isConnected = false;
    }
  }
}
