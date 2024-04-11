import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListDevicesPageRoutingModule } from './list-devices-routing.module';

import { ListDevicesPage } from './list-devices.page';
import { Network } from '@ionic-native/network/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListDevicesPageRoutingModule
  ],
  declarations: [ListDevicesPage],
  providers: [Network]
})
export class ListDevicesPageModule {}
