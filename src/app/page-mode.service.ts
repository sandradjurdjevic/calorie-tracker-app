import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PageModeService {
  //za food-item-details
  dodavanjeStavkiUReceptMode: boolean;
  dodavanjeStavkeUnosaFoodMode: boolean;
  //za recept-details
  dodavanjeNovogRecepta: boolean;
  izmenaRecepta: boolean;
  //za stiklic u pretraga/tabs/food
  itemSelected: boolean;
  //spoljni kljucevi
  idRecepta: string;
  idKorisnika: string;

  constructor() {}

  getDodavanjeStavkiUReceptMode():boolean{
    return this.dodavanjeStavkiUReceptMode;
  }
  setDodavanjeStavkiUReceptMode(value: boolean){
    this.dodavanjeStavkiUReceptMode=value;
  }
  getDodavanjeStavkeUnosaFoodMode():boolean{
    return this.dodavanjeStavkeUnosaFoodMode;
  }
  setDodavanjeStavkeUnosaFoodMode(value: boolean){
    this.dodavanjeStavkeUnosaFoodMode=value;
  }
  getDodavanjeNovogRecepta():boolean{
    return this.dodavanjeNovogRecepta;
  }
  setDodavanjeNovogRecepta(value: boolean){
    this.dodavanjeNovogRecepta=value;
  }
  getItemSelected():boolean{
    return this.itemSelected;
  }
  setItemSelected(value: boolean){
    this.itemSelected=value;
  }
  getIdRecepta():string{
    return this.idRecepta;
  }
  setIdRecepta(value: string){
    this.idRecepta= value;
  }
  getIdKorisnika():string{
    return this.idKorisnika;
  }
  setIdKorisnika(value: string){
    this.idKorisnika= value;
  }
}
