import { Component, Input, OnInit } from '@angular/core';
import { FoodService } from '../food.service';
import { Food } from '../food.model';
import { PageModeService } from 'src/app/page-mode.service';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-food',
  templateUrl: './food.page.html', 
  styleUrls: ['./food.page.scss'],
})
export class FoodPage implements OnInit {
  itemSelected: boolean;
  items: Food[];
  itemsAll: Food[];
  private foodSub: Subscription;

  constructor(private foodService: FoodService, private pageService: PageModeService, private nav: NavController) {
   } 

  ngOnInit() {
    this.foodSub = this.foodService.food.subscribe((food) => {
      this.items = food;
      this.itemsAll = food;
    });
  }

  ionViewWillEnter(){
    this.foodService.getFood().subscribe((items) => {
      // this.quotes = quotes;
    });
    this.itemSelected = this.pageService.getItemSelected();
  }

  onCheckMarkClick(): void{
    this.pageService.setItemSelected(false);
    if(this.pageService.getDodavanjeStavkeUnosaFoodMode()){
      this.pageService.setDodavanjeStavkeUnosaFoodMode(false);
      this.nav.navigateForward('/unos');
    }
    if(this.pageService.getDodavanjeStavkiUReceptMode()){
      this.pageService.setDodavanjeStavkiUReceptMode(false);

      this.nav.navigateForward(`/pretraga/tabs/cookbook/${this.pageService.getIdRecepta()}`);
    }
  }

  searchFunction(value: string){
    if(value.length > 0){
      let pretragaNamirnice : Food[] = [];
      this.items.forEach(i => {
        if(i.naziv === value){
          pretragaNamirnice.push(i);
        }
      });
      this.items = pretragaNamirnice;
    }else{
      this.items = this.itemsAll;
    }
    
  }
  

}
