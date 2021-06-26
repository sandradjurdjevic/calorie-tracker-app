import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Stavka } from 'src/app/unos/stavka.model';
import { StavkaService } from 'src/app/unos/stavka.service';
import { RecipeModalComponent } from '../recipe-modal/recipe-modal.component';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.scss'],
})
export class RecipeItemComponent implements OnInit {
  @Input() recipe: Recipe;
  kolicina: string;
  recipeStavka: Recipe;
  
  constructor(private modalCtrl: ModalController, private nav: NavController,private stavkaService: StavkaService) { }

  ngOnInit() {}
  
  onRecipeDetails(){

    this.modalCtrl
      .create({
        component: RecipeModalComponent,
        componentProps: {naslov: 'Dodavanje u dnevni unos', recipe: this.recipe, buttonText: 'DODAJ U DNEVNI UNOS'}
      })
      .then((modal) => {
        modal.present();
        return modal.onDidDismiss();
      }).then((resultData) => {
      if (resultData.role === 'confirm') {
        console.log(resultData);
        this.kolicina =  resultData.data.recipeData.kolicina;
        this.recipeStavka =  resultData.data.recipeData.recipe;

        
        this.stavkaService.addStavka(this.recipeStavka.ukupnoKalorija, this.recipeStavka.ukupnoMasti,
        this.recipeStavka.ukupnoUgljenihHidrata,
        this.recipeStavka.ukupnoProteina, +this.kolicina,
        null, this.recipe.id).subscribe((stavke) => {
          console.log('Stavka dodata u dnevni unos...');
        });
        
        this.nav.navigateForward('/unos');
      }
    });
    

  }
}
