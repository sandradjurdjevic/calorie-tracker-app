import { Component, Input, OnInit } from '@angular/core';
import { Food } from '../../food.model';
import { PageModeService } from 'src/app/page-mode.service';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.page.html',
  styleUrls: ['./item-details.page.scss'],
})
export class ItemDetailsPage implements OnInit {
  @Input() item: Food;
  
  @Input() buttonText: string;

  kolicina:string = '1';
  mernaJedinica: string = '';
  kalorija: number; masti:number; proteina:number; ugljenihHidrata:number;

  isLoading = false;

  constructor(private pageService: PageModeService, private modalCtrl: ModalController) { 

   }

  ngOnInit() {
    this.kalorija = this.item.kalorije100g;
    this.masti = this.item.masti100g;
    this.proteina = this.item.proteini100g;
    this.ugljenihHidrata = this.item.ugljeniHidrati100g;
    console.log(this.kalorija , this.masti , this.proteina , this.ugljenihHidrata);
  }
  ionViewWillEnter(){
    
  }

  onChangeOfUnit(value): void {
    this.mernaJedinica = value;
    console.log(this.mernaJedinica);
    
  }

  onChangeOfUnetaKolicina(event: Event): void {
    this.kolicina = (event.target as HTMLInputElement).value;
      if(this.kolicina.length > 0){
        this.kalorija= (+this.kolicina*this.item.kalorije100g);
        this.masti= (+this.kolicina*this.item.masti100g);
        this.ugljenihHidrata= (+this.kolicina*this.item.ugljeniHidrati100g);
        this.proteina= (+this.kolicina*this.item.proteini100g);
      }
    
  }

  onDodaj(): void {
    this.pageService.setItemSelected(true);
    this.item.kalorije100g=+this.kalorija;
    this.item.masti100g=+this.masti;
    this.item.ugljeniHidrati100g=+this.ugljenihHidrata;
    this.item.proteini100g=+this.proteina;
    this.modalCtrl.dismiss(
      {
        data: {
          item: this.item,
          kolicina: +this.kolicina,
          mernaJedinica: this.mernaJedinica
        }
      },
      'confirm'
    
    );

    
  }

}
