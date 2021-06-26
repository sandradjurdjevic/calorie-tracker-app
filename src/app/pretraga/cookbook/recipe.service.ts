import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {map, switchMap, take, tap} from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Recipe } from './recipe.model';

interface RecipeData {
  id: string;
  naziv: string;
  opis: string;
  ukupnoKalorija: number;
  ukupnoMasti: number;
  ukupnoProteina: number;
  ukupnoUgljenihHidrata: number;
  idKorisnik: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  private _recipes = new BehaviorSubject<Recipe[]>([]);
  private _newRecipe = new BehaviorSubject<Recipe>(null);
  constructor(private http: HttpClient, private authService: AuthService) {
  }

  get recipes() {
    return this._recipes.asObservable();
  } 

  get recipeId() {
    return this._newRecipe.asObservable().pipe(
      map((recipe) => {
        if (recipe) {
          return recipe.id;
        } else {
          return null;
        }
      })
    );
  }

  getRecipe(id: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.get<RecipeData>(
          `https://calorie-tracker-6147b-default-rtdb.europe-west1.firebasedatabase.app/recipes/${id}.json?auth=${token}`
        );
      }),
      map((resData: RecipeData) => {
        return new Recipe(
          id,
          resData.naziv,
          resData.opis,
          resData.ukupnoKalorija,
          resData.ukupnoMasti,
          resData.ukupnoProteina,
          resData.ukupnoUgljenihHidrata,
          resData.idKorisnik
        );
      })
    );
  }

  addRecipe(naziv:string,opis:string,ukupnoKalorija:number,ukupnoMasti:number,
    ukupnoProteina:number,ukupnoUgljenihHidrata:number){
    let generatedId;
    let newRecipe: Recipe;
    let fetchedUserId: string;

    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap((token) => {
        newRecipe = new Recipe(
          null,
          naziv,
          opis,
          ukupnoKalorija,
          ukupnoMasti,
          ukupnoProteina,
          ukupnoUgljenihHidrata,
          fetchedUserId
        );
        return this.http.post<{ name: string }>(
          `https://calorie-tracker-6147b-default-rtdb.europe-west1.firebasedatabase.app/recipes.json?auth=${token}`, newRecipe);
      }),
      take(1),
      switchMap((resData) => {
        generatedId = resData.name;
        return this.recipes;
      }),
      take(1),
      tap((recipes) => {
        newRecipe.id = generatedId;
        this._recipes.next(recipes.concat(newRecipe));
      })
    );
  }

  getRecipes() {
    let userId;
    return this.authService.userId.pipe(
      take(1),
      switchMap(id => {
        userId=id;
        return this.authService.token;
      }),
      take(1),
      switchMap((token) => {
        return this.http
          .get<{ [key: string]: RecipeData }>(
            `https://calorie-tracker-6147b-default-rtdb.europe-west1.firebasedatabase.app/recipes.json?auth=${token}`
          );
      }),
      take(1),
      switchMap((resData: any) => {
        const recipes: Recipe[] = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key) && resData[key].idKorisnik==userId) {
            recipes.push(new Recipe(key, resData[key].naziv, resData[key].opis,
              resData[key].ukupnoKalorija, resData[key].ukupnoMasti,
              resData[key].ukupnoProteina,resData[key].ukupnoUgljenihHidrata,
              resData[key].idKorisnik)
            );
          }
        }
        this._recipes.next(recipes);
        return recipes;
      })
    
    );

  }

  editRecipe(
    id: string,
    naziv: string,
    opis: string,
    ukupnoKalorija: number,
    ukupnoMasti:number,
    ukupnoProteina:number,
    ukupnoUgljenihHidrata:number
  ) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.put(
          `https://calorie-tracker-6147b-default-rtdb.europe-west1.firebasedatabase.app/recipes/${id}.json?auth=${token}`,
          {
            naziv,
            opis,
            ukupnoKalorija,
            ukupnoMasti,
            ukupnoProteina,
            ukupnoUgljenihHidrata,
            
          }
        );
      }),
      switchMap(() => {
        return this.recipes;
      }),
      take(1),
      tap((recipes) => {
        const updatedRecipeIndex = recipes.findIndex((r) => r.id === id);
        const updatedRecipes = [...recipes];
        updatedRecipes[updatedRecipeIndex] = new Recipe(
          id,
          naziv,
          opis,
          ukupnoKalorija,
          ukupnoMasti,
          ukupnoProteina,
          ukupnoUgljenihHidrata,
          'idKorisnik'
        );
        this._recipes.next(updatedRecipes);
      })
    );
  }

  deleteRecipe(id: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.delete(
          `https://calorie-tracker-6147b-default-rtdb.europe-west1.firebasedatabase.app/recipes/${id}.json?auth=${token}`
        );
      }),
      switchMap(() => {
        return this.recipes; 
      }),
      take(1),
      tap((recipes) => {
        this._recipes.next(recipes.filter((r) => r.id !== id));
      })
    );
  }

}
