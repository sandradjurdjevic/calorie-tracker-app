import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  isLoading = false;
  constructor(private authService: AuthService, private router: Router,private alertCtrl: AlertController,
    private us:UserService) { }

  ngOnInit() {
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

          this.router.navigateByUrl('/unos');
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
}
