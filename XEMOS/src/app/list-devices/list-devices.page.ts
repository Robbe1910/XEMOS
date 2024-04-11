import { Component, OnInit } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { Platform } from '@ionic/angular';

declare var WifiWizard2: any;

@Component({
  selector: 'app-list-devices',
  templateUrl: './list-devices.page.html',
  styleUrls: ['./list-devices.page.scss'],
})
export class ListDevicesPage implements OnInit {
  wifiName: string = '';

  constructor(private network: Network, private platform: Platform) { }

  ngOnInit() {
    this.checkWifiConnection();
  }

  checkWifiConnection() {
    this.platform.ready().then(() => {
      if (this.network.type === 'wifi') {
        this.getWifiSSID().then(ssid => {
          this.wifiName = ssid;
          console.log('WiFi Name:', this.wifiName);
        });
      } else {
        console.log('No WIFi connection available');
      }
    });
  }

  private getWifiSSID(): Promise<string> {
    return new Promise((resolve, reject) => {
      WifiWizard2.getConnectedSSID((ssid: string) => {
        resolve(ssid);
      }, (error: any) => {
        console.error('Error obteniendo el SSID de WiFi:', error);
        reject('Error obteniendo el SSID de WiFi');
      });
    });
  }
}
