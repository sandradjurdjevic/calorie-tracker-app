import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
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
  stavke: Stavka[];

  ukupnoKalorija: number = 0;
  isLoading = false;

  constructor(private stavkaService: StavkaService, private pageService: PageModeService, 
    private foodService:FoodService, private recipeService: RecipesService, private unosService:DnevniUnosService,
    private nav: NavController, private authService: AuthService) { 
    
  }

  ngOnInit() {
    
    this.unosService.dnevniUnos.subscribe((dnevniUnos) => {
      this.unos = dnevniUnos;
      
    })
    this.stavkaService.stavkePretraga.subscribe((stavke) => {
      this.stavke = stavke;
    })


    let danasnjiDatum =formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    
    this.authService.userId.subscribe((id)=>{
      this.idKorisnika = id;
    })
    this.unosService.getDnevniUnosi().subscribe((unosi) => {
      
    var noviRegistrovaniKorisnik=false;
      for(const u in unosi){
        if(unosi[u].idKorisnik===this.idKorisnika){
          if(danasnjiDatum === unosi[u].datum){
            console.log('Postavljen unos');
            this.unos = unosi[u];
            this.unosService.setDnevniUnos(this.unos);
          }else{
            this.unosService.addDnevniUnos().subscribe((unos) => {
              this.unos = unos;
              console.log('Dodat novi unos')
            });
          }
          noviRegistrovaniKorisnik=true;
        }
      }
      if(!noviRegistrovaniKorisnik){
        this.unosService.addDnevniUnos().subscribe((unos) => {
          this.unos = unos;
          console.log('Dodat novi unos za novog korisnika')
        });
      }

    });
  }


  ionViewWillEnter(){
    //svaki put kad se udje na stranicu ponovo ucitava stavke za danasnji unos
    //umesto preko id-a pretrazivati i preko datuma nekako
    
    this.isLoading = true;
    if(this.unos!=null){
      this.stavkaService.getStavke(this.unos.id).subscribe((stavke) => {
        console.log('get stavke');
        this.isLoading = false;
        this.izracunajUkupnoKalorija(stavke);
      })
    }
    
    this.pageService.setItemSelected(false);
  }

  izracunajUkupnoKalorija(stavke: Stavka[]):void{
    if(stavke!=null){
      stavke.forEach(s => {
        this.ukupnoKalorija+=s.kalorija;
      });
    }
    this.unosService.editDnevniUnos(this.unos.id, this.idKorisnika, this.unos.datum, this.ukupnoKalorija).subscribe(
    ()=>{ console.log('Unos izmenjen') });
    
    
  }

  onFabClick(){
    this.pageService.setDodavanjeStavkeUnosaFoodMode(true);
    this.pageService.setDodavanjeStavkiUReceptMode(false);
  }

  ionViewDidLeave(){
    this.pageService.setDodavanjeStavkeUnosaFoodMode(true);
    this.pageService.setDodavanjeStavkiUReceptMode(false); 
  }


}
