import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import {Food} from './food.model';

interface FoodData {
  kalorija100g: number;
  masti100g: number;
  naziv: string;
  proteina100g: number;
  ugljenihHidrata100g: number;
}

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private _food = new BehaviorSubject<Food[]>([]);

  constructor(private http: HttpClient, private authService: AuthService) { }

  get food() {
    return this._food.asObservable();
  }

  getFood() {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http
          .get<{ [key: string]: FoodData }>(
            `https://calorie-tracker-6147b-default-rtdb.europe-west1.firebasedatabase.app/food.json?auth=${token}`
          );
      }),
      map((foodData: any) => {
        console.log(foodData);
        const foods: Food[] = [];
        for (const key in foodData) {
          if (foodData.hasOwnProperty(key)) {
            foods.push(new Food(key, foodData[key].naziv, foodData[key].kalorija100g, foodData[key].masti100g, foodData[key].proteina100g, foodData[key].ugljenihHidrata100g)
            );
          }
        }
        return foods;
      }),
      tap(foods => {
        this._food.next(foods);
      })
    );

  }

  getFoodItem(id: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.get<FoodData>(
          `https://calorie-tracker-6147b-default-rtdb.europe-west1.firebasedatabase.app/food/${id}.json?auth=${token}`
        );
      }),
      map((resData: FoodData) => {
        return new Food(
          id,
          resData.naziv,
          resData.kalorija100g,
          resData.masti100g,
          resData.proteina100g, 
          resData.ugljenihHidrata100g
        );
      })
    );
  }
}
