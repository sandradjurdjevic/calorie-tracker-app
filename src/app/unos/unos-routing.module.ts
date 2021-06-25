import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UnosPage } from './unos.page';

const routes: Routes = [
  {
    path: '',
    component: UnosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UnosPageRoutingModule {}
