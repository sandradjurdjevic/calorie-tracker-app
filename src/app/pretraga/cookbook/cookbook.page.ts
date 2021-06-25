import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { PageModeService } from 'src/app/page-mode.service';
import { Recipe } from './recipe.model';
import { RecipesService } from './recipe.service';

@Component({
  selector: 'app-cookbook',
  templateUrl: './cookbook.page.html',
  styleUrls: ['./cookbook.page.scss'],
})
export class CookbookPage implements OnInit {
  recipes: Recipe[];

  constructor(private recipeService: RecipesService, private modalCtrl: ModalController,private pageService: PageModeService, private nav: NavController) {
    
   }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.pageService.setDodavanjeStavkeUnosaFoodMode(false);
    //pretraziti recepte prema id korisnika
    this.recipes = this.recipeService.recipes;
  }

  onAddRecipeClick(){
    //izgenerisati id za novi recept, ubaciti odmah id korisnika
    var newRecipe: Recipe = {id: '5',opis:'',idKorisnik:'',naziv:'',ukupnoKalorija:'',ukupnoMasti:'',ukupnoProteina:'',ukupnoUgljenihHidrata:''};
    this.recipeService.addRecipe(newRecipe);
    this.pageService.setIdRecepta(newRecipe.id); //pamcenje spoljnog kljuca zbog prelaska na stranicu za dodavanje sastojaka
    this.pageService.setDodavanjeNovogRecepta(true);
    this.nav.navigateForward(`/pretraga/tabs/cookbook/${newRecipe.id}`);
  }

}
