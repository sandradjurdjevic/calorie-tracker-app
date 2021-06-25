import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Recipe } from 'src/app/pretraga/cookbook/recipe.model';
import { RecipesService } from 'src/app/pretraga/cookbook/recipe.service';
import { Food } from 'src/app/pretraga/food.model';
import { FoodService } from 'src/app/pretraga/food.service';
import { Stavka } from '../stavka.model';

@Component({
  selector: 'app-stavka-modal',
  templateUrl: './stavka-modal.component.html',
  styleUrls: ['./stavka-modal.component.scss'],
})
export class StavkaModalComponent implements OnInit {
  @Input() naslov: string;
  @Input() naziv: string;
  @Input() stavka: Stavka;
  kolicina: string; kalorija: string; masti: string; ugljenihHidrata: string; proteina:string;

  food: Food;
  recipe: Recipe;

  constructor(private modalCtrl: ModalController, private foodService: FoodService, private recipeService:RecipesService) { }

  ngOnInit() {
    console.log(this.stavka.kolicina);
    this.kolicina = this.stavka.kolicina.toString();
    this.kalorija = this.stavka.kalorija.toString();
    this.masti = this.stavka.masti.toString();
    this.ugljenihHidrata = this.stavka.ugljenihHidrata.toString();
    this.proteina = this.stavka.proteina.toString();
  }

  onClose() {
    this.modalCtrl.dismiss();
  }

  onChangeOfUnetaKolicina(event: Event){
    this.kolicina = (event.target as HTMLInputElement).value;
    if(this.stavka.idFood != null){
    
      this.foodService.getFoodItem(this.stavka.idFood).subscribe((item) => {
        this.food = item;
      })
      if(this.kolicina.length > 0){
        this.kalorija= (+this.kolicina*+this.food.kalorije100g).toString();
        this.masti= (+this.kolicina*+this.food.masti100g).toString();
        this.ugljenihHidrata= (+this.kolicina*+this.food.ugljeniHidrati100g).toString();
        this.proteina= (+this.kolicina*+this.food.proteini100g).toString();
      }
    }
    if(this.stavka.idRecept != null){
      this.recipe = this.recipeService.getRecipe(this.stavka.idRecept);
      if(this.kolicina.length > 0){
        this.kalorija= (+this.kolicina*+this.recipe.ukupnoKalorija).toString();
        this.masti= (+this.kolicina*+this.recipe.ukupnoMasti).toString();
        this.ugljenihHidrata= (+this.kolicina*+this.recipe.ukupnoUgljenihHidrata).toString();
        this.proteina= (+this.kolicina*+this.recipe.ukupnoProteina).toString();
      }
    }
    
  }

  onIzmeniStavku() {
    this.stavka.kolicina=+this.kolicina;
    this.stavka.kalorija=+this.kalorija;
    this.stavka.masti=+this.masti;
    this.stavka.ugljenihHidrata=+this.ugljenihHidrata;
    this.stavka.proteina=+this.proteina;
    this.modalCtrl.dismiss(
      {
        stavkaData: {
          stavka: this.stavka
        }
      },
      'confirm'
    
    );
  }

}
