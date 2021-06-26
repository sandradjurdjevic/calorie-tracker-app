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
  kolicina: string; kalorija: number; masti: number; ugljenihHidrata: number; proteina:number;

  food: Food;
  recipe: Recipe;

  constructor(private modalCtrl: ModalController, private foodService: FoodService, private recipeService:RecipesService) { }

  ngOnInit() {
    this.kolicina = this.stavka.kolicina.toString();
    this.kalorija = this.stavka.kalorija;
    this.masti = this.stavka.masti;
    this.ugljenihHidrata = this.stavka.ugljenihHidrata;
    this.proteina = this.stavka.proteina;
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
        this.kalorija= (+this.kolicina*this.food.kalorije100g);
        this.masti= (+this.kolicina*this.food.masti100g);
        this.ugljenihHidrata= (+this.kolicina*this.food.ugljeniHidrati100g);
        this.proteina= (+this.kolicina*this.food.proteini100g);
      }
    }
    if(this.stavka.idRecept != null){
      this.recipeService.getRecipe(this.stavka.idRecept).subscribe((recept) => {
        this.recipe = recept;
      })
      if(this.kolicina.length > 0){
        this.kalorija= (+this.kolicina*+this.recipe.ukupnoKalorija);
        this.masti= (+this.kolicina*+this.recipe.ukupnoMasti);
        this.ugljenihHidrata= (+this.kolicina*+this.recipe.ukupnoUgljenihHidrata);
        this.proteina= (+this.kolicina*+this.recipe.ukupnoProteina);
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
