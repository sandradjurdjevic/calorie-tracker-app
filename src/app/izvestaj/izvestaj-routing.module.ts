import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IzvestajPage } from './izvestaj.page';

const routes: Routes = [
  {
    path: '',
    component: IzvestajPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IzvestajPageRoutingModule {}
