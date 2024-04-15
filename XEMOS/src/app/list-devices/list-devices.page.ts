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

  constructor(private platform: Platform) {}

  ngOnInit() {
    this.platform.ready().then(() => {
      this.checkConnection();
      this.getWifiName();
    });
  }

  checkConnection() {
    if (navigator.connection && navigator.connection.type) {
      switch (navigator.connection.type) {
        case Connection.WIFI:
          this.networkType = 'WiFi connection';
          break;
        case Connection.ETHERNET:
          this.networkType = 'Ethernet connection';
          break;
        case Connection.CELL_2G:
        case Connection.CELL_3G:
        case Connection.CELL_4G:
          this.networkType = 'Cellular connection';
          break;
        case Connection.NONE:
          this.networkType = 'No network connection';
          break;
        default:
          this.networkType = 'Unknown connection';
      }
    } else {
      this.networkType = 'Network information not available';
    }
  }

  getWifiName() {
    if (typeof WifiWizard2 !== 'undefined') {
      WifiWizard2.getConnectedSSID((ssid: string) => {
        this.wifiName = ssid;
      }, (error: any) => {
        console.error('Error obteniendo el SSID de WiFi:', error);
        this.wifiName = 'Error obteniendo el SSID de WiFi';
      });
    } else {
      console.error('WifiWizard2 no está definido. Asegúrate de haber instalado y configurado correctamente el plugin cordova-plugin-network-information.');
    }
  }
}
