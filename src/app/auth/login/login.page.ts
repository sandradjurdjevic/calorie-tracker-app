import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { UserService } from 'src/app/user.service';
import { DnevniUnosService } from 'src/app/unos/dnevni-unos.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  //idKorisnika=null;
  isLoading = false;
  constructor(private authService: AuthService, private navCtrl: NavController,private alertCtrl: AlertController,
    private us:UserService, private unosService: DnevniUnosService) { }

  ngOnInit() {
  }

  onLogIn(logInForm: NgForm) {
    
    console.log('Logovanje...');
    if (logInForm.valid) {
      //console.log('Validna forma...');
      this.authService.logIn(logInForm.value).subscribe(resData => {
        console.log('Pamcenje korisnika...');
          this.isLoading = false;
          console.log(resData);

          this.us.setUser();

          this.postaviUnos();

          
        },
        errRes => {
          console.log(errRes);
          this.isLoading = false;
          let message = 'Netacan email ili lozinka';

          

          const code = errRes.error.error.message;
          if (code === 'EMAIL_NOT_FOUND') {
            message = 'Email adresa nije pronadjena.';
          } else if (code === 'INVALID_PASSWORD') {
            message = 'Uneli ste pogresnu lozinku.';
          }

          this.alertCtrl.create({
            header: 'Greska',
            message,
            buttons: ['Okay']
          }).then((alert) => {
            alert.present();
          });

          logInForm.reset();

        });
      }
  
    
  }


postaviUnos(){
    let danasnjiDatum =formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    
    //if(this.idKorisnika!=null){
      this.unosService.getDnevniUnosi().subscribe((unosi) => {
      
        var noviRegistrovaniKorisnik=false;
        var postoji = false;
        for(const u in unosi){
          if(danasnjiDatum === unosi[u].datum){
              console.log('Postavljen unos');
              this.unosService.setDnevniUnos(unosi[u]);
              console.log('Zapamcen unos');
              postoji = true;
              //this.router.navigateByUrl('/unos');
            }
              noviRegistrovaniKorisnik=true;
        }
        if(!postoji){
          this.unosService.addDnevniUnos().subscribe((unos) => {
              //await this.delay(5000);
            console.log('Dodat novi unos')
            //this.router.navigateByUrl('/unos');
          });
        }
        if(!noviRegistrovaniKorisnik){
          this.unosService.addDnevniUnos().subscribe((unos) => {
            console.log('Dodat novi unos za novog korisnika');
            //this.router.navigateByUrl('/unos');
          });
        }
        
        this.navCtrl.navigateForward('/unos');
      })
    //}
  }
}
