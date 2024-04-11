import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListDevicesPageRoutingModule } from './list-devices-routing.module';

import { ListDevicesPage } from './list-devices.page';
import { Network } from '@ionic-native/network/ngx';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListDevicesPageRoutingModule,
    SharedModule
  ],
  declarations: [ListDevicesPage],
  providers: [Network]
})
export class ListDevicesPageModule {}
