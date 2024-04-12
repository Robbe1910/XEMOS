import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoadingScreenPageLogin } from './loading-screen.page';

const routes: Routes = [
  {
    path: '',
    component: LoadingScreenPageLogin
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoadingScreenPageRoutingModule {}
