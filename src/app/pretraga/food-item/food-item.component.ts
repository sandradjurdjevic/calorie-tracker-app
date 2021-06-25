import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { PageModeService } from 'src/app/page-mode.service';
import { StavkaService } from 'src/app/unos/stavka.service';
import { Food } from '../food.model';

@Component({
  selector: 'app-food-item',
  templateUrl: './food-item.component.html',
  styleUrls: ['./food-item.component.scss'],
})
export class FoodItemComponent implements OnInit {
  @Input() item: Food;
  constructor() { }

  ngOnInit() {}

}
