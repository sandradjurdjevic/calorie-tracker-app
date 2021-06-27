import { Component, Input, OnInit } from '@angular/core';
import { FoodService } from '../food.service';
import { Food } from '../food.model';
import { PageModeService } from 'src/app/page-mode.service';
import { ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { StavkaModalComponent } from 'src/app/unos/stavka-modal/stavka-modal.component';
import { StavkaService } from 'src/app/unos/stavka.service';
import { RecipeFoodItem } from '../cookbook/food-of-recipe/recipe-food-item.model';
import { RecipeDetailsPage } from '../cookbook/recipe-details/recipe-details.page';
import { RecipeFoodItemService } from '../cookbook/food-of-recipe/recipe-food-item.service';
import { ItemDetailsPage } from './item-details/item-details.page';

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

  constructor(private foodService: FoodService, private receptItemService:RecipeFoodItemService,private stavkaService:StavkaService,private modalCtrl:ModalController, private pageService: PageModeService, private nav: NavController) {
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

  selectItem(item: Food){
    if(this.pageService.getDodavanjeStavkeUnosaFoodMode()){
    console.log('Otvaranje modala za detalje o namirnici...');
    this.modalCtrl
      .create({
        component: ItemDetailsPage,
        componentProps: {item: item, buttonText: 'DODAJ U DNEVNI UNOS'}
      })
      .then((modal) => {
        modal.present();
        return modal.onDidDismiss();
      }).then((resultData) => {
      if (resultData.role === 'confirm') {
        console.log(resultData);

        this.stavkaService.addStavka(item.naziv, resultData.data.data.item.kalorije100g,resultData.data.data.item.masti100g,resultData.data.data.item.ugljeniHidrati100g,resultData.data.data.item.proteini100g, resultData.data.data.kolicina,item.id ,null).subscribe((nizStavki)=>{
          console.log('Stavka dodata u dnevni unos...');
          this.itemSelected = this.pageService.getItemSelected();
        })
        
      }
    });
    }
    if(this.pageService.getDodavanjeStavkiUReceptMode()){
      console.log('Otvaranje modala za detalje o namirnici...');
      this.modalCtrl
      .create({
          component: ItemDetailsPage,
          componentProps: {item: item, buttonText: 'DODAJ U RECEPT'}
        })
        .then((modal) => {
          modal.present();
          return modal.onDidDismiss();
        }).then((resultData) => {
          if (resultData.role === 'confirm') {
            console.log(resultData);

            var recipeItem: RecipeFoodItem = new RecipeFoodItem('',item.id , resultData.data.data.kolicina, this.pageService.getIdRecepta());
            if(this.pageService.getDodavanjeNovogRecepta()){
              this.receptItemService.addRecipeItemUNiz(recipeItem);
            }
            if(this.pageService.getIzmenaRecepta()){
              this.receptItemService.editRecipeItemBaza(this.pageService.getIdRecepta(), recipeItem.idFood, recipeItem.kolicina).subscribe((item)=>{
            }) }
  
            console.log('Stavka dodata u recept...');
            this.itemSelected = this.pageService.getItemSelected();
          } 
        })
    }
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
