import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PretragaPage } from './pretraga.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: PretragaPage,

    children:[
      {
        path: 'cookbook',
        loadChildren: () => import('./cookbook/cookbook.module').then( m => m.CookbookPageModule)
      },
      {
        path: 'food',
        loadChildren: () => import('./food/food.module').then( m => m.FoodPageModule)
      },
      {
        path: '',
        redirectTo: '/pretraga/tabs/food',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/pretraga/tabs/food',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PretragaPageRoutingModule {}
