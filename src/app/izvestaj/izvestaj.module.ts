import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IzvestajPageRoutingModule } from './izvestaj-routing.module';

import { IzvestajPage } from './izvestaj.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IzvestajPageRoutingModule
  ],
  declarations: [IzvestajPage]
})
export class IzvestajPageModule {}
