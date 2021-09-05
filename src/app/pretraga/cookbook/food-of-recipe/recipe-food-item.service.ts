import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { RecipesService } from '../recipe.service';
import { RecipeFoodItem } from './recipe-food-item.model';

interface RecipeItemData{
  id: string,
  idFood: string,
  kolicina: number,
  idRecept: string
}

@Injectable({
  providedIn: 'root'
})
export class RecipeFoodItemService {
  private _recipeItems = new BehaviorSubject<RecipeFoodItem[]>([]);
  
  recipeFoodIitemsPretraga: RecipeFoodItem[];
  recipeFoodIitems: RecipeFoodItem[] = [];

  constructor(private recipeService: RecipesService, private authService: AuthService, private http: HttpClient) { }

  get recipeItems() {
    return this._recipeItems.asObservable();
  } 

  setPrivremeniNiz(sastojci: RecipeFoodItem[]){
    this.recipeFoodIitems = sastojci;
  }
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

  addRecipeItemUBazu(idFood: string, kolicina: number, mernaJedinica: string){
    let idRecept;
    let newRecipeItem: RecipeFoodItem = new RecipeFoodItem(null, idFood, kolicina, mernaJedinica, null
    );

    return this.recipeService.recipeId.pipe(
      take(1),
      switchMap(idRecepta => {
        console.log(idRecepta);
        idRecept = idRecepta;
        return this.authService.token;
      }),
        take(1),
        switchMap((token) => {
          newRecipeItem.idRecept = idRecept;
          return this.http.post<{ name: string }>(
            `https://calorie-tracker-6147b-default-rtdb.europe-west1.firebasedatabase.app/recipeItem.json?auth=${token}`, newRecipeItem);
        }),
        take(1),
        switchMap((resData) => {
          newRecipeItem.id = resData.name;
          return this.recipeItems;
        }),
        take(1),
        tap((items) => {
          this._recipeItems.next(items.concat(newRecipeItem));
        })
        
        );
  }

  getRecipeFoodItemsBaza(idRecepta:string){
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http
          .get<{ [key: string]: RecipeItemData }>(
            `https://calorie-tracker-6147b-default-rtdb.europe-west1.firebasedatabase.app/recipeItem.json?auth=${token}`
          );
      }),
      map((sastojci: any) => {
        console.log(sastojci);
        const trazeni: RecipeFoodItem[] = [];
        for (const key in sastojci) {
          if (sastojci.hasOwnProperty(key) && sastojci[key].idRecept==idRecepta) {
            trazeni.push(new RecipeFoodItem(key, sastojci[key].idFood, sastojci[key].kolicina, sastojci[key].mernaJedinica, sastojci[key].idRecept)
            );
          }
        }
          return trazeni;
      }), take(1),
      tap((trazeni)=>{
        if(trazeni.length > 0){
          this._recipeItems.next(trazeni);
        }
      })
    )
  }

  deleteRecipeItemBaza(id:string){
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.delete(
          `https://calorie-tracker-6147b-default-rtdb.europe-west1.firebasedatabase.app/recipeItem/${id}.json?auth=${token}`
        );
      }),
      switchMap(() => {
        return this.recipeItems; 
      }),
      take(1),
      tap((items) => {
        this._recipeItems.next(items.filter((r) => r.id !== id));
      })
    );
  }

  editRecipeItemBaza(idRecepta: string, idFood: string, kolicina: number, mernaJedinica: string){
    let newRecipeItem: RecipeFoodItem = new RecipeFoodItem(null, idFood, kolicina, mernaJedinica, idRecepta
    );

    return this.authService.token.pipe(
      take(1),
        switchMap((token) => {
          return this.http.post<{ name: string }>(
            `https://calorie-tracker-6147b-default-rtdb.europe-west1.firebasedatabase.app/recipeItem.json?auth=${token}`, newRecipeItem);
        }),
        take(1),
        switchMap((resData) => {
          newRecipeItem.id = resData.name;
          return this.recipeItems;
        }),
        take(1),
        tap((items) => {
          this._recipeItems.next(items.concat(newRecipeItem));
        })
        
        );
  }
}
