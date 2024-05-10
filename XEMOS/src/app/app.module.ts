import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { LoadingScreenPage } from './loading-screen/loading-screen.page';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { sensorReducer } from './redux/reducers/sensor.reducer';
import { SensorEffects } from './redux/effects/sensor.effects';

import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';





@NgModule({
  declarations: [AppComponent, LoadingScreenPage],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    ReactiveFormsModule, 
    HttpClientModule, 
    SharedModule, 
    StoreModule.forRoot({ sensor: sensorReducer }),
    EffectsModule.forRoot([SensorEffects]),
    StoreDevtoolsModule.instrument()],
  providers: [LocalNotifications, AndroidPermissions, InAppBrowser, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}