import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PasswordConfirmationPageRoutingModule } from './password-confirmation-routing.module';

import { PasswordConfirmationPage } from './password-confirmation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PasswordConfirmationPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [PasswordConfirmationPage]
})
export class PasswordConfirmationPageModule {}
