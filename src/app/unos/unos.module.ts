import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UnosPageRoutingModule } from './unos-routing.module';

import { UnosPage } from './unos.page';
import { StavkaModalComponent } from './stavka-modal/stavka-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UnosPageRoutingModule
  ],
  declarations: [UnosPage, StavkaModalComponent]
})
export class UnosPageModule {}
