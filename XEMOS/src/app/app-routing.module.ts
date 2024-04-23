import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { MainContainerComponent } from './main-container/main-container.component';



const routes: Routes = [
  {
    path: '', // Path vacío para redirección
    redirectTo: 'loading', // Redirige al path 'loading'
    pathMatch: 'full' // Asegura que la redirección se aplique solo cuando la URL es exactamente ''
  },
  {
    path: 'app',
    component: MainContainerComponent, // Componente contenedor principal
    canActivate: [AuthGuard], // Protege todas las rutas bajo el path 'app'
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
  { path: 'loading', loadChildren: () => import('./loading-screen/loading-screen.module').then(m => m.LoadingScreenPageModule) },
  { path: 'loading-login', loadChildren: () => import('./loading-screen-login/loading-screen.module').then(m => m.LoadingScreenPageModule) },
  { path: 'loading-delete-account', loadChildren: () => import('./loading-screen delete-account/loading-screen.module').then(m => m.LoadingScreenPageModule) },
  { path: 'confirmation-page', loadChildren: () => import('./confirmation-page/confirmation-page.module').then(m => m.ConfirmationPagePageModule) },
  { path: 'confirm-email', loadChildren: () => import('./confirm-email/confirm-email.module').then(m => m.ConfirmEmailPageModule) },
  {
    path: 'change-password',
    loadChildren: () => import('./change-password/change-password.module').then( m => m.ChangePasswordPageModule)
  },
  {
    path: 'password-confirmation',
    loadChildren: () => import('./password-confirmation/password-confirmation.module').then( m => m.PasswordConfirmationPageModule)
  },


];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
