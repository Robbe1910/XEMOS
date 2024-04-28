import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Terminal3DComponent } from './componentes/terminal3D/terminal3D.component';
import { PortadaComponent } from './componentes/portada/portada.component';
import { Subportada} from "./componentes/subportada/subportada";
import { PageMainDescComponent } from './componentes/page-main-desc/page-main-desc.component';
import { PageSecondaryDescComponent } from './componentes/page-secondary-desc/page-secondary-desc.component';
import { PageThirdDescComponent } from './componentes/page-third-desc/page-third-desc.component';
import { PageHardSoftComponent } from './componentes/page-hard-soft/page-hard-soft.component';
import { PageHardSoft1Component } from './componentes/page-hard-soft1/page-hard-soft1.component';
import { TerminalUCR3DComponent } from './componentes/terminal-ucr3-d/terminal-ucr3-d.component';
import { Esp32Component } from './componentes/esp32/esp32.component';
import { SensorsAmpliationsComponent } from './componentes/sensors-ampliations/sensors-ampliations.component';
import { OdsComponent } from './componentes/ods/ods.component';
import { OdsFinalComponent } from './componentes/ods-final/ods-final.component';
import { ConfigAppdesc0Component } from './componentes/config-appdesc0/config-appdesc0.component';
import { ConfigAppdesc1Component } from './componentes/config-appdesc1/config-appdesc1.component';
import { ConfigAppdesc2Component } from './componentes/config-appdesc2/config-appdesc2.component';
import { ConfigAppdesc3Component } from './componentes/config-appdesc3/config-appdesc3.component';
import { Terminal3DprotosComponent } from './componentes/terminal3-dprotos/terminal3-dprotos.component';
import { ConfigAppFunctionComponent } from './componentes/config-app-function/config-app-function.component';
import { TerminalUcr3DAdvancedComponent } from './componentes/terminal-ucr3-d-advanced/terminal-ucr3-d-advanced.component';
import { TerminalUcr3DDeepSleepComponent } from './componentes/terminal-ucr3-d-deep-sleep/terminal-ucr3-d-deep-sleep.component';
import { TerminalUcr3DSchemaComponent } from './componentes/terminal-ucr3-d-schema/terminal-ucr3-d-schema.component';
import { FullSchemaComponent } from './componentes/full-schema/full-schema.component';
import { PresupuestoComponent } from './componentes/presupuesto/presupuesto.component';
import { MapComponent } from './componentes/map/map.component';
import { PageFunctionDescComponent } from './componentes/page-function-desc/page-function-desc.component';

@NgModule({
  declarations: [
    AppComponent,
    Terminal3DComponent,
    PortadaComponent,
    Subportada,
    PageMainDescComponent,
    PageSecondaryDescComponent,
    PageThirdDescComponent,
    PageHardSoftComponent,
    PageHardSoft1Component,
    TerminalUCR3DComponent,
    Esp32Component,
    SensorsAmpliationsComponent,
    OdsComponent,
    OdsFinalComponent,
    ConfigAppdesc0Component,
    ConfigAppdesc1Component,
    ConfigAppdesc2Component,
    ConfigAppdesc3Component,
    Terminal3DprotosComponent,
    ConfigAppFunctionComponent,
    TerminalUcr3DAdvancedComponent,
    TerminalUcr3DDeepSleepComponent,
    TerminalUcr3DSchemaComponent,
    FullSchemaComponent,
    PresupuestoComponent,
    MapComponent,
    PageFunctionDescComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
