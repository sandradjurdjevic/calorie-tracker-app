import { Injectable } from '@angular/core';
import { RecipeFoodItem } from './recipe-food-item.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeFoodItemService {
  recipeFoodIitemsPretraga: RecipeFoodItem[];
  recipeFoodIitems: RecipeFoodItem[] = [];

  //constructor() { }

  getRecipeFoodItemsNiz(idRecept: string) : RecipeFoodItem[] {
    if(this.recipeFoodIitems.length <=0){
      return null;
    }else{
      return this.recipeFoodIitemsPretraga = this.recipeFoodIitems.filter( (i) => i.idRecept === idRecept );
    }
  }

  addRecipeItemUNiz(recipeFoodIitem: RecipeFoodItem): void {
    this.recipeFoodIitems.push(recipeFoodIitem);
  }
}
