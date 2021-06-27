import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { delay } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { PageModeService } from '../page-mode.service';
import { RecipesService } from '../pretraga/cookbook/recipe.service';
import { FoodService } from '../pretraga/food.service';
import { DnevniUnos } from './dnevni-unos.model';
import { DnevniUnosService } from './dnevni-unos.service';
import { Stavka } from './stavka.model';
import { StavkaService } from './stavka.service';

@Component({
  selector: 'app-unos',
  templateUrl: './unos.page.html',
  styleUrls: ['./unos.page.scss'],
})
export class UnosPage implements OnInit {
  idKorisnika: string;
  unos: DnevniUnos = null;
  stavke: any[];

  ukupnoKalorija: number = 0;
  isLoading = false;

  constructor(private stavkaService: StavkaService, private pageService: PageModeService, 
    private foodService:FoodService, private recipeService: RecipesService, private unosService:DnevniUnosService,
    private nav: NavController, private authService: AuthService) { 
    
  }
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms))
  };

  ngOnInit() {
    
    this.unosService.dnevniUnos.subscribe((dnevniUnos) => {
      this.unos = dnevniUnos;
      
    })
    this.stavkaService.stavkePretraga.subscribe( (stavkePretraga) => {
      this.stavke = stavkePretraga;
    })

  }

  ionViewWillEnter(){
    //svaki put kad se udje na stranicu ponovo ucitava stavke za danasnji unos
    //umesto preko id-a pretrazivati i preko datuma nekako
    console.log('get stavke');
    this.isLoading = true;
    if(this.unos!=null){
      console.log('get stavke');
      this.stavkaService.getStavke().subscribe((stavke) => {
        
        console.log('get stavke');
        this.izracunajUkupnoKalorija(stavke);
      })
    }
    
    this.pageService.setItemSelected(false);
  }

  izracunajUkupnoKalorija(stavke: Stavka[]):void{
    this.ukupnoKalorija=0;
    console.log(stavke);
     for(const i in stavke){
       this.ukupnoKalorija+=stavke[i].kalorija;
     }
     
     this.isLoading = false;
  }

  onFabClick(){
    this.pageService.setDodavanjeStavkeUnosaFoodMode(true);
    this.pageService.setDodavanjeStavkiUReceptMode(false);
  }

  ionViewDidLeave(){
    this.unosService.editDnevniUnos(this.unos.id, this.idKorisnika, this.unos.datum, this.ukupnoKalorija).subscribe(
      ()=>{ console.log('Unos izmenjen') });
      
    this.pageService.setDodavanjeStavkeUnosaFoodMode(true);
    this.pageService.setDodavanjeStavkiUReceptMode(false); 
  }


}
