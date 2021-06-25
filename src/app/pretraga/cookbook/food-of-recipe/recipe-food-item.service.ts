import { Injectable } from '@angular/core';
import { RecipeFoodItem } from './recipe-food-item.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeFoodItemService {
  recipeFoodIitemsPretraga: RecipeFoodItem[];
  recipeFoodIitems: RecipeFoodItem[] = [
    {id: '1', idFood: '4', idRecept: '1', kolicina: '2'},
    {id: '2', idFood: '6', idRecept: '1', kolicina: '100'},
    {id: '3', idFood: '4', idRecept: '2', kolicina: '2'},
    {id: '4', idFood: '6', idRecept: '2', kolicina: '100'},
  ];

  //constructor() { }

  getRecipeFoodItems(idRecept: string) : RecipeFoodItem[] {
    //return this.recipeFoodIitems.find((i) => i.id === id);
    return this.recipeFoodIitemsPretraga = this.recipeFoodIitems.filter( (i) => i.idRecept === idRecept );
  
  }

  addRecipeItem(recipeFoodIitem: RecipeFoodItem): void {
    this.recipeFoodIitems.push(recipeFoodIitem);
  }
}
