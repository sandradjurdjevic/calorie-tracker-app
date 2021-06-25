import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AuthGuard} from './auth/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canLoad: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'unos',
    pathMatch: 'full'
  },
  {
    path: 'unos',
    loadChildren: () => import('./unos/unos.module').then( m => m.UnosPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'pretraga',
    loadChildren: () => import('./pretraga/pretraga.module').then( m => m.PretragaPageModule),
    canLoad: [AuthGuard]
  },
 
  {
    path: 'register',
    loadChildren: () => import('./auth/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'profil',
    loadChildren: () => import('./profil/profil.module').then( m => m.ProfilPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'izvestaj',
    loadChildren: () => import('./izvestaj/izvestaj.module').then( m => m.IzvestajPageModule),
    canLoad: [AuthGuard]
  }




];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
