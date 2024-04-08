import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListDevicesPage } from './list-devices.page';

const routes: Routes = [
  {
    path: '',
    component: ListDevicesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListDevicesPageRoutingModule {}
