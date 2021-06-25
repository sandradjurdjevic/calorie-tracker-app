import { Component, Input, OnInit } from '@angular/core';
import { Food } from 'src/app/pretraga/food.model';
import { FoodService } from 'src/app/pretraga/food.service';
import { RecipeFoodItem } from './recipe-food-item.model';

@Component({
  selector: 'app-food-recipe',
  templateUrl: './food-recipe.component.html',
  styleUrls: ['./food-recipe.component.scss'],
})
export class FoodRecipeComponent implements OnInit {
  @Input() sastojak: RecipeFoodItem; 
  food: Food;
  constructor(private foodService: FoodService) {
    
   }

  ngOnInit() {
    this.foodService.getFoodItem(this.sastojak.idFood).subscribe((item) => {
      this.food = item;
    })
  }

}
