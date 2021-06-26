import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { PageModeService } from 'src/app/page-mode.service';
import { Recipe } from 'src/app/pretraga/cookbook/recipe.model';
import { RecipesService } from 'src/app/pretraga/cookbook/recipe.service';
import { Food } from 'src/app/pretraga/food.model';
import { FoodService } from 'src/app/pretraga/food.service';
import { StavkaModalComponent } from '../stavka-modal/stavka-modal.component';
import { Stavka } from '../stavka.model';
import { StavkaService } from '../stavka.service';

@Component({
  selector: 'app-stavka-unosa',
  templateUrl: './stavka-unosa.component.html',
  styleUrls: ['./stavka-unosa.component.scss'],
}) 
export class StavkaUnosaComponent implements OnInit {

  @Input() stavka: Stavka;
    naziv: string;
    isLoading = false;

  constructor(private pageService: PageModeService,private foodService: FoodService, private stavkaService: StavkaService, 
              private recipeService: RecipesService, private nav: NavController, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.isLoading=true;
    //u tabeli stavka nemam atribut naziv vec ga dovlacim preko id-a u zavisnosti od toga da li je food/recept
    if(this.stavka.idFood != null){
      this.foodService.getFoodItem(this.stavka.idFood).subscribe((item) => {
        this.naziv = item.naziv;
        this.isLoading=false;
      })
      
    }
    if(this.stavka.idRecept != null){
      this.recipeService.getRecipe(this.stavka.idRecept).subscribe((recept) => {

        if(recept != 'obrisan'){
          this.naziv = recept.naziv;
        }
        
        this.isLoading=false;
      })
    }
  }

  onStavkaClick(){
    console.log('Otvaranje modala za izmenu stavke...');
    
    this.modalCtrl
      .create({
        component: StavkaModalComponent,
        componentProps: {naslov: 'Izmena stavke', naziv: this.naziv, stavka: this.stavka}
      })
      .then((modal) => {
        modal.present();
        return modal.onDidDismiss();
      }).then((resultData) => {
      if (resultData.role === 'confirm') {
        console.log(resultData);
        this.stavka.kolicina = resultData.data.stavkaData.stavka.kolicina;
        this.stavka.kalorija = resultData.data.stavkaData.stavka.kalorija;
        this.stavka.masti = resultData.data.stavkaData.stavka.masti;
        this.stavka.ugljenihHidrata = resultData.data.stavkaData.stavka.ugljenihHidrata;
        this.stavka.proteina = resultData.data.stavkaData.stavka.proteina;
        
        this.stavkaService.editStavka(this.stavka.redniBroj, this.stavka.kalorija, this.stavka.masti, 
          this.stavka.ugljenihHidrata, this.stavka.proteina, this.stavka.kolicina, 
          this.stavka.idFood, this.stavka.idRecept).subscribe((stavke)=>{})
      }
    });
  }

}
