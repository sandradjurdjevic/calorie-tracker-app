import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { PageModeService } from '../page-mode.service';

@Component({
  selector: 'app-pretraga',
  templateUrl: './pretraga.page.html',
  styleUrls: ['./pretraga.page.scss'],
})
export class PretragaPage implements OnInit {

  constructor(private pageService: PageModeService) { }

  ngOnInit() {
  }

  /*ionViewWillEnter(){
    this.pageService.setAddStavkaFoodMode(true);
  }*/
  

}
