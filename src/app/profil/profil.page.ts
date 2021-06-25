import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../user.service';
import { AuthService } from '../auth/auth.service';

import { User } from '../user.model';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {
  @ViewChild('profileForm',null) profileForm: NgForm;
  Ime:string;
  Prezime:string;
  Email:string;
  user:User;
 
  constructor(private authService: AuthService, private loadingCtrl: LoadingController, private router: Router,
    private alertCtrl: AlertController, private us:UserService) {
  }
 
  ngOnInit() {

   
    this.us.user.subscribe(resData => {
      this.user=resData;
      this.Ime=this.user.name;
      this.Prezime=this.user.lastname;
      this.Email=this.user.email;})


    /*this.us.getUser("").subscribe(resData => {
      this.Ime=resData.name;
      this.Prezime=resData.lastname;
      this.Email=resData.email;*/
      
    //this.profileForm.setValue({name:ime});
  }

  
}
