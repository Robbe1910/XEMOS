import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoadingScreenPageRoutingModule } from './loading-screen-routing.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoadingScreenPageRoutingModule
  ],
  declarations: []
})
export class LoadingScreenPageModule {}
