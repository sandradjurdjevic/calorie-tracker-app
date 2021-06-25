import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Stavka } from 'src/app/unos/stavka.model';
import { Food } from '../../food.model';
import { Recipe } from '../recipe.model';
import { RecipesService } from '../recipe.service';
import { StavkaService } from  'src/app/unos/stavka.service';
import { PageModeService } from 'src/app/page-mode.service';
import { FoodService } from '../../food.service';
import { NavController } from '@ionic/angular';
import { RecipeFoodItem } from '../food-of-recipe/recipe-food-item.model';
import { RecipeFoodItemService } from '../food-of-recipe/recipe-food-item.service';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.page.html',
  styleUrls: ['./recipe-details.page.scss'],
})
export class RecipeDetailsPage implements OnInit {
  recipe: Recipe = {id: '',naziv: '',opis:'',ukupnoKalorija:'',ukupnoMasti:'',ukupnoProteina:'',ukupnoUgljenihHidrata:'',idKorisnik:''};
  sastojci: RecipeFoodItem[];

  buttonText: string;

  kolicina: string = '1';
  kalorija:string; masti:string; proteina:string; ugljenihHidrata:string;

  naziv: string; opis: string;

  //ngIf promenljive
  karticeNoviRecept: boolean;

  constructor(private route:ActivatedRoute, 
    private stavkaService: StavkaService, 
    private recipeService: RecipesService, 
    private foodService: FoodService,
    private sastojciService: RecipeFoodItemService,
    private pageService: PageModeService,
    private nav: NavController) {

   }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      this.recipe = this.recipeService.getRecipe(paramMap.get('recipeId'));
    })
  }

  ionViewWillEnter(){
    this.kalorija = this.recipe.ukupnoKalorija;
    this.masti = this.recipe.ukupnoMasti;
    this.proteina = this.recipe.ukupnoProteina;
    this.ugljenihHidrata = this.recipe.ukupnoUgljenihHidrata;

    if(this.pageService.getDodavanjeNovogRecepta()){
      this.sastojci = this.sastojciService.getRecipeFoodItems(this.recipe.id);
      this.buttonText = "SACUVAJ RECEPT"
      this.izracunajKartice();
    }
    
  }

  izracunajKartice(){
    var foodItem ;
    var ukupnoK =0;var ukupnoM = 0;var ukupnoP=0;var ukupnoUH=0;
    this.sastojci.forEach(sastojak => {
      this.foodService.getFoodItem(sastojak.idFood).subscribe((item) => {
        foodItem = item;
      })
      ukupnoK += +foodItem.kalorije100g*+sastojak.kolicina;
      ukupnoM += +foodItem.masti100g*+sastojak.kolicina;
      ukupnoP += +foodItem.proteini100g*+sastojak.kolicina;
      ukupnoUH += +foodItem.ugljeniHidrati100g*+sastojak.kolicina;
    });
    this.kalorija = ukupnoK.toString();
    this.masti = ukupnoM.toString();
    this.proteina = ukupnoP.toString();
    this.ugljenihHidrata = ukupnoUH.toString();
    

  }

  onChangeOfNazivRecepta(event: Event): void {
    this.recipe.naziv = (event.target as HTMLInputElement).value;
  }
  onChangeOfOpisRecepta(event: Event): void {
    this.recipe.opis = (event.target as HTMLInputElement).value;
  }

  onDodajSastojke():void{
    this.pageService.setDodavanjeStavkiUReceptMode(true);
    this.pageService.setDodavanjeStavkeUnosaFoodMode(false);
  }

  onDodaj(){
    this.recipe.ukupnoKalorija = this.kalorija;
    this.recipe.ukupnoMasti = this.masti;
    this.recipe.ukupnoProteina = this.proteina;
    this.recipe.ukupnoUgljenihHidrata = this.ugljenihHidrata;
    
    this.recipeService.editRecipe(this.recipe);
    this.pageService.setDodavanjeNovogRecepta(false);
    console.log('Recept je sacuvan...');
    this.nav.navigateForward('/pretraga/tabs/cookbook');
    
  }

}
