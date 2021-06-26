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

  isLoading = false;
  constructor(private recipeService: RecipesService, private modalCtrl: ModalController,private pageService: PageModeService, private nav: NavController) {
    
   }

  ngOnInit() {
    this.recipeService.recipes.subscribe((recipes)=>{
      this.recipes = recipes;
    })
  }

  ionViewWillEnter(){
    this.isLoading = true;

    this.pageService.setDodavanjeStavkeUnosaFoodMode(false);
    this.recipeService.getRecipes().subscribe((recipes)=>{
      
      console.log('get recipes');
      this.isLoading=false;
    });
  }

  onAddRecipeClick(){
    this.pageService.setDodavanjeNovogRecepta(true);
    this.pageService.setIzmenaRecepta(false);
    this.pageService.setBrisanjeRecepta(false);
    this.nav.navigateForward(`/pretraga/tabs/cookbook/0`);
  }

}
