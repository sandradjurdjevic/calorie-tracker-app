import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipesService } from '../recipe.service';
import { PageModeService } from 'src/app/page-mode.service';
import { FoodService } from '../../food.service';
import { NavController } from '@ionic/angular';
import { RecipeFoodItem } from '../food-of-recipe/recipe-food-item.model';
import { RecipeFoodItemService } from '../food-of-recipe/recipe-food-item.service';
import { NgForm } from '@angular/forms';
import { PhotoService } from 'src/app/services/photo.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.page.html',
  styleUrls: ['./recipe-details.page.scss'],
})
export class RecipeDetailsPage implements OnInit {
  idRecepta:string;

  recipe: Recipe;
  sastojci: RecipeFoodItem[];

  buttonText: string;

  kolicina: string = '1';
  kalorija:number; masti:number; proteina:number; ugljenihHidrata:number;

  naziv: string; instrukcije: string; vreme: number; mode:string; 

  photos: Photograph[];
  photo: Photograph;
  src: string;

  //ngIf promenljive
  karticeNoviRecept: boolean;
  isLoading = false;
  newRecipe: boolean = true;

  constructor(private route:ActivatedRoute,  
    private recipeService: RecipesService, 
    private foodService: FoodService,
    private sastojciService: RecipeFoodItemService,
    private pageService: PageModeService,
    private nav: NavController, private photoService: PhotoService) {

   }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('recipeId')) {
        this.nav.navigateBack('/pretraga/tabs/food');
        return;
      }
      if (paramMap.get('recipeId')==='0') {
        this.recipe = new Recipe('','','',0,'',0,0,0,0,'');
        this.kalorija = 0;
        this.masti = 0;
        this.proteina = 0;
        this.ugljenihHidrata = 0;
        this.idRecepta = '0';
      }else{
        this.isLoading=true;
        this.recipeService.getRecipe(paramMap.get('recipeId')).subscribe((recept) => {
          if(recept != 'obrisan'){
            console.log(recept);
            this.recipe = recept;
            this.isLoading=false;
            this.kalorija = this.recipe.ukupnoKalorija; this.masti = this.recipe.ukupnoMasti;this.proteina = this.recipe.ukupnoProteina;this.ugljenihHidrata = this.recipe.ukupnoUgljenihHidrata;
            this.naziv = this.recipe.naziv; this.instrukcije = this.recipe.instrukcije;
            this.mode = this.recipe.mode; this.vreme = this.recipe.vreme;
            this.idRecepta = paramMap.get('recipeId');
          }
            
          });
      }
        
    })
    if(this.pageService.getIzmenaRecepta() || this.pageService.getBrisanjeRecepta()){
      this.sastojciService.recipeItems.subscribe((items)=>{
        this.sastojci = items;
      })
    }
  }

  ionViewWillEnter(){

    if(this.pageService.getDodavanjeNovogRecepta()){
      var s = this.sastojciService.getRecipeFoodItemsNiz(this.pageService.getIdRecepta());
      if(s==null){
        this.sastojci=[];
      }else{
        this.sastojci=s;
      }
      
      this.src = "https://www.pngkey.com/png/detail/4-44913_plus-sign-clipart-blue-plus-sign.png";
      this.newRecipe = false;

      this.buttonText = "SACUVAJ RECEPT"
      this.izracunajKartice();
    }
    if(this.pageService.getIzmenaRecepta()){
      this.sastojciService.getRecipeFoodItemsBaza(this.idRecepta).subscribe((items)=>{
        console.log('get sastojci')
        this.izracunajKartice();
      })
      this.buttonText = "IZMENI RECEPT";
      this.postaviSliku();
    }
    if(this.pageService.getBrisanjeRecepta()){
      this.sastojciService.getRecipeFoodItemsBaza(this.idRecepta).subscribe((items)=>{
        console.log('get sastojci')
        this.izracunajKartice();
      })
      this.buttonText = "OBRISI RECEPT";
      this.postaviSliku();
    }
    
  }

  addPhotoToRecipe(){
    /*console.log(this.naziv);
    
    Camera.getPhoto({
      
      resultType: CameraResultType.Uri, // file-based data; provides best performance
      source: CameraSource.Camera, // automatically take a new photo with the camera
      quality: 100 // highest quality (0 to 100)
    }).then((res) => {
      this.photoService.addNewToGallery(res, this.naziv).then((converted) => {
        
        this.src = converted.webviewPath;
        //this.newRecipe = false;
        console.log(this.src);
      }).catch((e) => {
        console.log(e);
      })
      
    }).catch((e)=>{
      console.log(e);
    });*/
  }

  postaviSliku(){
    
   

    for (let p of this.photos) {
      console.log(p.filepath);
      if(p.filepath === this.recipe.naziv +'.jpeg'){
        this.photo = p;
        this.src = p.webviewPath;
        this.newRecipe = false;
      }
      
    }
  }

  onChangeOfMode(value): void {
    this.mode = value;
    
  }

  izracunajKartice(){
    //var itemF;
    //var ukupnoK =0;var ukupnoM = 0;var ukupnoP=0;var ukupnoUH=0;
    this.sastojci.forEach(sastojak => {
      this.isLoading = true;
      this.foodService.getFoodItem(sastojak.idFood).subscribe((item) => {
        console.log(item);
        //itemF = item;
        this.isLoading = false;
        this.kalorija += item.kalorije100g*sastojak.kolicina;
        this.masti += item.masti100g*sastojak.kolicina;
        this.proteina += item.proteini100g*sastojak.kolicina;
        this.ugljenihHidrata += item.ugljeniHidrati100g*sastojak.kolicina;
        console.log(this.kalorija)
        console.log(this.masti)
        console.log(this.proteina)
        console.log(this.ugljenihHidrata)
      })
    });

  }


  onDodajSastojke():void{
    this.pageService.setDodavanjeStavkiUReceptMode(true);
    this.pageService.setDodavanjeStavkeUnosaFoodMode(false);
    
    this.pageService.setIdRecepta(this.idRecepta);
  }

  onDodaj(){
    //if (RecipeForm.valid) {
    this.recipe.ukupnoKalorija = this.kalorija;
    this.recipe.ukupnoMasti = this.masti;
    this.recipe.ukupnoProteina = this.proteina;
    this.recipe.ukupnoUgljenihHidrata = this.ugljenihHidrata;
    if(this.pageService.getDodavanjeNovogRecepta()){

      this.recipeService.addRecipe(this.naziv, this.instrukcije, this.mode, this.vreme, 
        this.recipe.ukupnoKalorija,this.recipe.ukupnoMasti,this.recipe.ukupnoProteina,
        this.recipe.ukupnoUgljenihHidrata).subscribe((recipes)=>{
        console.log('Recept je sacuvan...');
        this.sastojci.forEach(s => {
          this.sastojciService.addRecipeItemUBazu(s.idFood, s.kolicina, s.mernaJedinica).subscribe((item)=>{
            console.log('Sastojci su sacuvani...');
          })
        });
        
      });
      
      this.sastojciService.setPrivremeniNiz([]);
      this.pageService.setDodavanjeNovogRecepta(false);
      this.nav.navigateForward('/pretraga/tabs/cookbook');  
    //}
  }
    if(this.pageService.getIzmenaRecepta()){
      this.recipeService.editRecipe(this.recipe.id, this.naziv, this.instrukcije, this.mode,  this.vreme,
        this.recipe.ukupnoKalorija,this.recipe.ukupnoMasti,this.recipe.ukupnoProteina,
        this.recipe.ukupnoUgljenihHidrata).subscribe((recipes)=>{
        console.log('Recept je izmenjen...');
      });
      this.pageService.setIzmenaRecepta(false);
      this.nav.navigateForward('/pretraga/tabs/cookbook'); 
    }
    if(this.pageService.getBrisanjeRecepta()){
      this.recipeService.deleteRecipe(this.recipe.id).subscribe((recipes)=>{
        console.log('Recept je obrisan...');
      });

      this.sastojci.forEach(s => {
        this.sastojciService.deleteRecipeItemBaza(s.id).subscribe((item)=>{})
      });

      this.pageService.setIzmenaRecepta(false);
      this.nav.navigateForward('/pretraga/tabs/cookbook'); 
    }
    
  }

  
  
}
export interface Photograph {
  filepath: string;
  webviewPath: string;
}