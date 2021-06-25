import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CookbookPageRoutingModule } from './cookbook-routing.module';

import { CookbookPage } from './cookbook.page';
import { RecipeItemComponent } from './recipe-item/recipe-item.component';
import { RecipeDetailsPage } from './recipe-details/recipe-details.page';
import { RecipeModalComponent } from './recipe-modal/recipe-modal.component';
import { FoodRecipeComponent } from './food-of-recipe/food-recipe.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CookbookPageRoutingModule
  ],
  declarations: [CookbookPage, RecipeItemComponent, RecipeDetailsPage, RecipeModalComponent, FoodRecipeComponent]
})
export class CookbookPageModule {}
