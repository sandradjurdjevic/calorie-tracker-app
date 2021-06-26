import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipesService } from '../recipe.service';
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
  idRecepta:string;

  recipe: Recipe;
  sastojci: RecipeFoodItem[];

  buttonText: string;

  kolicina: string = '1';
  kalorija:number; masti:number; proteina:number; ugljenihHidrata:number;

  naziv: string; opis: string;

  //ngIf promenljive
  karticeNoviRecept: boolean;
  isLoading = false;

  constructor(private route:ActivatedRoute,  
    private recipeService: RecipesService, 
    private foodService: FoodService,
    private sastojciService: RecipeFoodItemService,
    private pageService: PageModeService,
    private nav: NavController) {

   }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('recipeId')) {
        this.nav.navigateBack('/pretraga/tabs/food');
        return;
      }
      if (paramMap.get('recipeId')==='0') {
        this.recipe = new Recipe('','','',0,0,0,0,'');
        this.kalorija = 0;
        this.masti = 0;
        this.proteina = 0;
        this.ugljenihHidrata = 0;
        this.idRecepta = '0';
      }else{
        this.isLoading=true;
        this.recipeService.getRecipe(paramMap.get('recipeId')).subscribe((recept) => {
            console.log(recept);
            this.recipe = recept;
            this.isLoading=false;
            this.kalorija = this.recipe.ukupnoKalorija;
            this.masti = this.recipe.ukupnoMasti;
            this.proteina = this.recipe.ukupnoProteina;
            this.ugljenihHidrata = this.recipe.ukupnoUgljenihHidrata;
            this.idRecepta = paramMap.get('recipeId');
          });
      }
        
    })
  }

  ionViewWillEnter(){

    if(this.pageService.getDodavanjeNovogRecepta()){
      var s = this.sastojciService.getRecipeFoodItemsNiz(this.pageService.getIdRecepta());
      if(s==null){
        this.sastojci=[];
      }else{
        this.sastojci=s;
      }
      this.buttonText = "SACUVAJ RECEPT"
      this.izracunajKartice();
    }
    if(this.pageService.getIzmenaRecepta()){
      this.sastojciService.getRecipeFoodItemsNiz(this.pageService.getIdRecepta());
      
      this.buttonText = "IZMENI RECEPT"
      this.izracunajKartice();
    }
    if(this.pageService.getBrisanjeRecepta()){
      this.sastojciService.getRecipeFoodItemsNiz(this.pageService.getIdRecepta());
      
      this.buttonText = "OBRISI RECEPT"
      this.izracunajKartice();
    }
    
  }

  izracunajKartice(){
    //var itemF;
    //var ukupnoK =0;var ukupnoM = 0;var ukupnoP=0;var ukupnoUH=0;
    this.sastojci.forEach(sastojak => {
      this.isLoading = true;
      this.foodService.getFoodItem(sastojak.idFood).subscribe((item) => {
        console.log(item);
        //itemF = item;
        this.isLoading = false;
        this.kalorija += item.kalorije100g*sastojak.kolicina;
        this.masti += item.masti100g*sastojak.kolicina;
        this.proteina += item.proteini100g*sastojak.kolicina;
        this.ugljenihHidrata += item.ugljeniHidrati100g*sastojak.kolicina;
        console.log(this.kalorija)
        console.log(this.masti)
        console.log(this.proteina)
        console.log(this.ugljenihHidrata)
      })
    });

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
    
    this.pageService.setIdRecepta(this.idRecepta);
  }

  onDodaj(){
    this.recipe.ukupnoKalorija = this.kalorija;
    this.recipe.ukupnoMasti = this.masti;
    this.recipe.ukupnoProteina = this.proteina;
    this.recipe.ukupnoUgljenihHidrata = this.ugljenihHidrata;
    
    this.recipeService.addRecipe(this.recipe.naziv, this.recipe.opis, 
      this.recipe.ukupnoKalorija,this.recipe.ukupnoMasti,this.recipe.ukupnoProteina,
      this.recipe.ukupnoUgljenihHidrata).subscribe((recipes)=>{
      console.log('Recept je sacuvan...');
    });

    this.pageService.setDodavanjeNovogRecepta(false);
    
    this.nav.navigateForward('/pretraga/tabs/cookbook');
    
  }

}
