import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {AlertController, LoadingController} from '@ionic/angular';
import {Router} from '@angular/router';
import { UserService } from 'src/app/user.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;

  constructor(private authService: AuthService, private loadingCtrl: LoadingController, private router: Router,
    private alertCtrl: AlertController, private us:UserService) {
  }

  ngOnInit() {
    this.registerForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      surname: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(7)]),
    });
  }



  onRegister() {
    this.loadingCtrl
      .create({message: 'Registering ... '})
      .then((loadingEl) => {
        loadingEl.present();
        
        this.authService.register(this.registerForm.value).subscribe(resData => {
          console.log('Registracija uspela');
          console.log(resData);
          loadingEl.dismiss();

          this.us.addUser(resData.localId,
            this.registerForm.value.name,
            this.registerForm.value.surname,
            this.registerForm.value.email).subscribe((users) => {
              });

          this.router.navigateByUrl('/unos');
        },errRes => {
          console.log(errRes);
          loadingEl.dismiss();
          let message = 'Greska';

          const code = errRes.error.error.message;
          if (code === 'EMAIL_EXISTS') {
            message = 'Email adresa vec postoji';
          } else if (code === 'TOO_MANY_ATTEMPTS_TRY_LATER') {
            message = 'Previse pokusaja. Probajte kasnije.';
          }

          this.alertCtrl.create({
            header: 'Greska',
            message,
            buttons: ['OK']
          }).then((alert) => {
            alert.present();
          });

          this.registerForm.reset();

        });
      });

  }


}
