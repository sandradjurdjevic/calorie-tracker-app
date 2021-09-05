import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../user.service';
import { AuthService } from '../auth/auth.service';

import { User } from '../user.model';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { PhotoService } from '../services/photo.service';
import { Directory, Filesystem } from '@capacitor/filesystem';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {
  @ViewChild('profileForm',null) profileForm: NgForm;
  
  user:User;
  photo: Photograph;
  src: string;

  haveImage: boolean = false;
  isLoading: boolean = false;
 
  photos:Photograph[];
  constructor(private photoService:PhotoService, private us:UserService) {
  }
 
   ngOnInit() {
      this.us.user.subscribe(resData => {
      
        this.user=resData;
        this.isLoading = true;
        
       

        for (let p of this.photos) {
          console.log(p.filepath);
          if(p.filepath === this.user.id +'.jpeg'){
            this.photo = p;
            this.src = p.webviewPath;
            this.haveImage = true;
          }
          
        }
      });
    
  }

   ionWillEnter(){
    
    
  }

  addPhotoToGallery(){
   /* Camera.getPhoto({
      resultType: CameraResultType.Uri, // file-based data; provides best performance
      source: CameraSource.Camera, // automatically take a new photo with the camera
      quality: 100 // highest quality (0 to 100)
    }).then((res) => {
      this.photoService.addNewToGallery(res, this.user.id).then((converted) => {
        this.src = converted.webviewPath;
        console.log(this.photo.webviewPath);
      })
      
    }).catch((e)=>{
      console.log(e);
    });*/

    
   // this.photoService.addNewToGallery(this.user.id);
  }

  
}
export interface Photograph {
  filepath: string;
  webviewPath: string;
}