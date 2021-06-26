import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { PageModeService } from 'src/app/page-mode.service';
import { RecipeFoodItem } from '../food-of-recipe/recipe-food-item.model';
import { RecipeFoodItemService } from '../food-of-recipe/recipe-food-item.service';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-modal',
  templateUrl: './recipe-modal.component.html',
  styleUrls: ['./recipe-modal.component.scss'],
})
export class RecipeModalComponent implements OnInit {
  @Input() naslov: string;
  @Input() recipe: Recipe;
  @Input() buttonText: string;

  kolicina: string; kalorija: number; masti: number; ugljenihHidrata: number; proteina:number;
  naziv: string; opis: string;
  sastojci: RecipeFoodItem[];

  constructor(private modalCtrl: ModalController, private sastojciService: RecipeFoodItemService, private pageService: PageModeService) { }

  ngOnInit() {
    console.log(this.recipe.naziv);
    
      this.naziv = this.recipe.naziv; this.opis=this.recipe.opis;
      this.kalorija= this.recipe.ukupnoKalorija; this.masti= this.recipe.ukupnoMasti; this.ugljenihHidrata= this.recipe.ukupnoUgljenihHidrata; this.proteina= this.recipe.ukupnoProteina; 
      this.sastojci = this.sastojciService.getRecipeFoodItemsNiz(this.recipe.id);
    
      this.kolicina = '1';
    
  }

  ionViewWillEnter(){
  }

  onClose() {
    this.modalCtrl.dismiss();
  }
/*
  onEditRecipeClick(event: Event){
    this.pageService.setIzmenaRecepta(true);
    this.pageService.setDodavanjeNovogRecepta(false);
    this.pageService.setBrisanjeRecepta(false);
   // this.navCtrl.navigateForward(`/pretraga/tabs/cookbook/${this.recipe.id}`);
    this.modalCtrl.dismiss();
  }
  onDeleteRecipeClick(event: Event){
    this.pageService.setBrisanjeRecepta(true);
    this.pageService.setDodavanjeNovogRecepta(false);
    this.pageService.setIzmenaRecepta(false);
  //  this.navCtrl.navigateForward(`/pretraga/tabs/cookbook/${this.recipe.id}`);
    this.modalCtrl.dismiss();
  }
*/
  onChangeOfUnetaKolicina(event: Event){
    this.kolicina = (event.target as HTMLInputElement).value;
      if(this.kolicina.length > 0){
        this.kalorija= (+this.kolicina*this.recipe.ukupnoKalorija);
        this.masti= (+this.kolicina*this.recipe.ukupnoMasti);
        this.ugljenihHidrata= (+this.kolicina*this.recipe.ukupnoUgljenihHidrata);
        this.proteina= (+this.kolicina*this.recipe.ukupnoProteina);
      }
  
  }

  onDodaj() {
    
      this.recipe.ukupnoKalorija = this.kalorija;
      this.recipe.ukupnoMasti = this.masti;
      this.recipe.ukupnoProteina = this.proteina;
      this.recipe.ukupnoUgljenihHidrata = this.ugljenihHidrata;
      this.modalCtrl.dismiss(
        {
          recipeData: {
            kolicina: this.kolicina,
            recipe: this.recipe
          }
        },
        'confirm'
      
      );
    
    
  }


}
