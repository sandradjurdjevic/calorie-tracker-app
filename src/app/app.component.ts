import { Component } from '@angular/core';
import {AuthService} from "./auth/auth.service";
import {Router} from "@angular/router";
import { NavController } from '@ionic/angular';
import { DnevniUnosService } from './unos/dnevni-unos.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private authService: AuthService, private unosService:DnevniUnosService, private navCtrl:NavController) {
  }

  onLogOut() {
    this.authService.logOut();
    this.unosService.setDnevniUnos(null);
    this.navCtrl.navigateForward('/login');
  }
}
