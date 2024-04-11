import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { MainContainerComponent } from './main-container/main-container.component';


const routes: Routes = [
  {
    path: '', // Path vacío para redirección
    redirectTo: 'login', // Redirige al path 'login'
    pathMatch: 'full' // Asegura que la redirección se aplique solo cuando la URL es exactamente ''
  },
  {
    path: 'app',
    component: MainContainerComponent, // Componente contenedor principal
    children: [
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'list-devices',
        loadChildren: () => import('./list-devices/list-devices.module').then(m => m.ListDevicesPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule)
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  { path: 'login', loadChildren: () => import('./auth/login/login.module').then(m => m.LoginPageModule) },
  { path: 'register', loadChildren: () => import('./auth/register/register.module').then(m => m.RegisterPageModule) },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
