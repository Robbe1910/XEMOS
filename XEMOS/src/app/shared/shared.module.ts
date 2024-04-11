import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { MainContainerComponent } from '../main-container/main-container.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [FooterComponent, MainContainerComponent],
  exports: [
    FooterComponent,
    MainContainerComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class SharedModule { }
