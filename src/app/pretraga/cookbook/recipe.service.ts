import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  recipes: Recipe[] = [
    {id: '1', naziv: 'Kajgana', opis: 'Jaja umucena sa sirom i malo brasna', ukupnoKalorija: "350", ukupnoMasti:"35", ukupnoProteina: "23", ukupnoUgljenihHidrata: "45", idKorisnik:"1"},
    {id: '2', naziv: 'Kajgana2', opis: 'Jaja umucena sa sirom i malo brasna', ukupnoKalorija: "350", ukupnoMasti:"35", ukupnoProteina: "23", ukupnoUgljenihHidrata: "45", idKorisnik:"1"},
  ];

  //constructor() { }

  getRecipe(id: string) {
    return this.recipes.find((i) => i.id === id);
  }

  addRecipe(recipe: Recipe): void {
    this.recipes.push(recipe);
  }

  editRecipe(recipe: Recipe): void{
    this.recipes.find((i) => i.id === recipe.id).naziv = recipe.naziv;
    this.recipes.find((i) => i.id === recipe.id).opis = recipe.opis;
    this.recipes.find((i) => i.id === recipe.id).ukupnoKalorija = recipe.ukupnoKalorija;
    this.recipes.find((i) => i.id === recipe.id).ukupnoMasti = recipe.ukupnoMasti;
    this.recipes.find((i) => i.id === recipe.id).ukupnoProteina = recipe.ukupnoProteina;
    this.recipes.find((i) => i.id === recipe.id).ukupnoUgljenihHidrata = recipe.ukupnoUgljenihHidrata;
  }
}
