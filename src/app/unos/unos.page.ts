import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { delay } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { PageModeService } from '../page-mode.service';
import { RecipesService } from '../pretraga/cookbook/recipe.service';
import { FoodService } from '../pretraga/food.service';
import { PhotoService } from '../services/photo.service';
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
  ukupnoMasti: number = 0;
  ukupnoProteina: number = 0;
  ukupnoUH: number = 0;
  isLoading = false;

  constructor(private stavkaService: StavkaService, private pageService: PageModeService, private unosService:DnevniUnosService,
     private modalCtrl: ModalController, private photoService:PhotoService) { 
    
  }

 ngOnInit() {  
  //await this.photoService.loadSaved();
    this.unosService.dnevniUnos.subscribe((dnevniUnos) => {
      this.unos = dnevniUnos;
    })
    this.stavkaService.stavkePretraga.subscribe( (stavkePretraga) => {
      this.stavke = stavkePretraga;
    })

  }

  ionViewDidEnter(){
    
    this.isLoading = true;
    if(this.unos!=null){
    
      this.stavkaService.getStavke().subscribe((s) => {
        this.stavke=s;
        this.izracunajUkupnoKalorija(s);
      })
    }
     
    this.pageService.setItemSelected(false);
  }

  izracunajUkupnoKalorija(stavke: Stavka[]):void{
    this.ukupnoKalorija=0;
     for(const i in stavke){
       this.ukupnoKalorija+=stavke[i].kalorija;
       this.ukupnoMasti+=stavke[i].masti;
       this.ukupnoProteina+=stavke[i].proteina;
       this.ukupnoUH+=stavke[i].ugljenihHidrata;
     }
     if(this.unos!=null){
      this.unosService.editDnevniUnos(this.unos.id, this.unos.datum, this.ukupnoKalorija).subscribe(
        ()=>{ console.log('Unos izmenjen') });
        this.isLoading = false;
    }
     
     
  }
 
  onFabClick(){
    this.pageService.setDodavanjeStavkeUnosaFoodMode(true);
    this.pageService.setDodavanjeStavkiUReceptMode(false);
  }

  ionViewDidLeave(){
    
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
        
        stavka.kolicina = resultData.data.stavkaData.stavka.kolicina;
        stavka.kalorija = resultData.data.stavkaData.stavka.kalorija;
        stavka.masti = resultData.data.stavkaData.stavka.masti;
        stavka.ugljenihHidrata = resultData.data.stavkaData.stavka.ugljenihHidrata;
        stavka.proteina = resultData.data.stavkaData.stavka.proteina;
        
        this.stavkaService.editStavka(stavka.redniBroj, stavka.naziv, stavka.kalorija, stavka.masti, 
          stavka.ugljenihHidrata, stavka.proteina, stavka.kolicina, stavka.mernaJedinica,
          stavka.idFood, stavka.idRecept).subscribe((stavke)=>{

            this.izracunajUkupnoKalorija(stavke);

          })

        
      }
    });
  }


}
