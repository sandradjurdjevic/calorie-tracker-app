import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FoodService } from '../../food.service';
import { Food } from '../../food.model';
import { Stavka } from 'src/app/unos/stavka.model';
import { StavkaService } from 'src/app/unos/stavka.service';
import { PageModeService } from 'src/app/page-mode.service';
import { NavController } from '@ionic/angular';
import { RecipeFoodItem } from '../../cookbook/food-of-recipe/recipe-food-item.model';
import { RecipeFoodItemService } from '../../cookbook/food-of-recipe/recipe-food-item.service';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.page.html',
  styleUrls: ['./item-details.page.scss'],
})
export class ItemDetailsPage implements OnInit {
  item: Food;
  
  buttonText: string;

  kolicina:string = '1';
  kalorija: number; masti:number; proteina:number; ugljenihHidrata:number;

  isLoading = false;
  constructor(private route: ActivatedRoute, private navCtrl:NavController,private pageService: PageModeService, 
    private foodService: FoodService, private nav: NavController,
     private stavkaService: StavkaService, private receptItemService: RecipeFoodItemService) { 

   }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('itemId')) {
        this.navCtrl.navigateBack('/pretraga/tabs/food');
        return;
      }
      this.isLoading=true;
      this.foodService
        .getFoodItem(paramMap.get('itemId'))
        .subscribe((item) => {
          console.log(item);
          this.item = item;
          this.isLoading=false;
          this.kalorija = this.item.kalorije100g;
          this.masti = this.item.masti100g;
          this.proteina = this.item.proteini100g;
          this.ugljenihHidrata = this.item.ugljeniHidrati100g;
        });
        
    })
    
  }
  ionViewWillEnter(){
    
    
    if(this.pageService.getDodavanjeStavkeUnosaFoodMode()){
      this.buttonText = "DODAJ U DNEVNI UNOS"
    }
    if(this.pageService.getDodavanjeStavkiUReceptMode()){
       this.buttonText = "DODAJ U RECEPT"
    }
  }

  onChangeOfUnetaKolicina(event: Event): void {
    this.kolicina = (event.target as HTMLInputElement).value;
      if(this.kolicina.length > 0){
        this.kalorija= (+this.kolicina*this.item.kalorije100g);
        this.masti= (+this.kolicina*this.item.masti100g);
        this.ugljenihHidrata= (+this.kolicina*this.item.ugljeniHidrati100g);
        this.proteina= (+this.kolicina*this.item.proteini100g);
      }
      
    
    
  }

  onDodaj(): void {
    if(this.pageService.getDodavanjeStavkeUnosaFoodMode()){
     
      this.stavkaService.addStavka(this.kalorija,this.masti,this.ugljenihHidrata,this.proteina,+this.kolicina,this.item.id ,null).subscribe((nizStavki)=>{
        console.log('Stavka dodata u dnevni unos...');
      })
      
      this.pageService.setItemSelected(true);
      this.nav.navigateForward('/pretraga');
    }
    if(this.pageService.getDodavanjeStavkiUReceptMode()){
      //izgenerisati random id
      var recipeItem: RecipeFoodItem = {id:'55',idFood: this.item.id ,idRecept: this.pageService.getIdRecepta(), kolicina: this.kolicina};
  
      this.receptItemService.addRecipeItem(recipeItem);

      console.log('Stavka dodata u recept...');
      this.pageService.setItemSelected(true);
      this.nav.navigateForward('/pretraga');
    }
  }

}
