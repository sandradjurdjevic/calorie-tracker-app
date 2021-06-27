import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { delay } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { PageModeService } from '../page-mode.service';
import { RecipesService } from '../pretraga/cookbook/recipe.service';
import { FoodService } from '../pretraga/food.service';
import { DnevniUnos } from './dnevni-unos.model';
import { DnevniUnosService } from './dnevni-unos.service';
import { StavkaModalComponent } from './stavka-modal/stavka-modal.component';
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
    private nav: NavController, private authService: AuthService, private modalCtrl: ModalController) { 
    
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
    this.unosService.editDnevniUnos(this.unos.id, this.unos.datum, this.ukupnoKalorija).subscribe(
      ()=>{ console.log('Unos izmenjen') });
      
    this.pageService.setDodavanjeStavkeUnosaFoodMode(true);
    this.pageService.setDodavanjeStavkiUReceptMode(false); 
  }

  selectStavka(stavka: Stavka){
    console.log('Otvaranje modala za izmenu stavke...');
    
    this.modalCtrl
      .create({
        component: StavkaModalComponent,
        componentProps: {naslov: 'Izmena stavke', naziv: stavka.naziv, stavka: stavka}
      })
      .then((modal) => {
        modal.present();
        return modal.onDidDismiss();
      }).then((resultData) => {
      if (resultData.role === 'confirm') {
        console.log(resultData);
        stavka.kolicina = resultData.data.stavkaData.stavka.kolicina;
        stavka.kalorija = resultData.data.stavkaData.stavka.kalorija;
        stavka.masti = resultData.data.stavkaData.stavka.masti;
        stavka.ugljenihHidrata = resultData.data.stavkaData.stavka.ugljenihHidrata;
        stavka.proteina = resultData.data.stavkaData.stavka.proteina;
        
        this.stavkaService.editStavka(stavka.redniBroj, stavka.naziv, stavka.kalorija, stavka.masti, 
          stavka.ugljenihHidrata, stavka.proteina, stavka.kolicina, 
          stavka.idFood, stavka.idRecept).subscribe((stavke)=>{

            this.izracunajUkupnoKalorija(stavke);

          })

        
      }
    });
  }


}
