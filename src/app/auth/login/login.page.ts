import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { UserService } from 'src/app/user.service';
import { DnevniUnosService } from 'src/app/unos/dnevni-unos.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  idKorisnika=null;
  isLoading = false;
  constructor(private authService: AuthService, private router: Router,private alertCtrl: AlertController,
    private us:UserService, private unosService: DnevniUnosService) { }

  ngOnInit() {
    this.authService.user.subscribe((user) => {
      if(user!=null){
        this.idKorisnika=user.id;
        console.log(user);
      }
    })
  }

  onLogIn(logInForm: NgForm) {
    this.isLoading = true;

    console.log(logInForm);
    if (logInForm.valid) {
      this.authService.logIn(logInForm.value).subscribe(resData => {
          this.isLoading = false;

          this.us.getCurrentUser().subscribe((user)=>{
            console.log('getUsers')
          });

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
    if(this.idKorisnika!=null){
      this.unosService.getDnevniUnosi().subscribe((unosi) => {
      
        var noviRegistrovaniKorisnik=false;
        for(const u in unosi){
          if(unosi[u].idKorisnik===this.idKorisnika){
            if(danasnjiDatum === unosi[u].datum){
              console.log('Postavljen unos');
              this.unosService.setDnevniUnos(unosi[u]);
              this.router.navigateByUrl('/unos');
            }else{
              this.unosService.addDnevniUnos().subscribe((unos) => {
                  //await this.delay(5000);
                console.log('Dodat novi unos')
                this.router.navigateByUrl('/unos');
              });
            }
              noviRegistrovaniKorisnik=true;
          }
        }
        if(!noviRegistrovaniKorisnik){
          this.unosService.addDnevniUnos().subscribe((unos) => {
            console.log('Dodat novi unos za novog korisnika');
            this.router.navigateByUrl('/unos');
          });
        }
      })
    }
  }
}
