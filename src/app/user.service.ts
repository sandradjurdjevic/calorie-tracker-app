import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, switchMap, take, tap} from 'rxjs/operators';
import {BehaviorSubject, Observable} from 'rxjs';
import {AuthService} from './auth/auth.service';
import { User } from './user.model';

interface UserData {
  name: string;
  lastname: string;
  email: string;
  key: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient, private authService: AuthService) {
  }



  get user() {
    
    return this._user.asObservable();
    
  }

  addUser(id: string, name: string, lastaname: string, email: string) {
   let generatedId;
    
    let newUser: User;
        newUser = new User(
          id,
          name,
          lastaname,
          email,
          null
        );
        return this.http.post<{ name: string }>(
          `https://calorie-tracker-6147b-default-rtdb.europe-west1.firebasedatabase.app/users.json`, newUser).
          pipe(
          take(1),
          switchMap((resData)=>{
            generatedId=resData.name;
            return this.user;}),take(1),tap((user)=>{
              newUser.key=generatedId;
              console.log(newUser.key);
              this._user.next(newUser);
            }));//ovde fali auth=${token} posle ? kada sredim uslov za bazu
      
        }

      getUser(id: string) {
            return this.http.get<UserData>(
              `https://calorie-tracker-6147b-default-rtdb.europe-west1.firebasedatabase.app/users/${id}.json`
            ).pipe(
          map((resData: UserData) => {
            return new User(
              id,
              resData.name,
              resData.lastname,
              resData.email,
              resData.key
            );
          }))
      }

      getCurrentUserid(){
            let fetchedUserId: string;
        
            return this.authService.userId.pipe(
              take(1),
              switchMap(userId => {
                fetchedUserId = userId;
                return this.authService.userId}))
            }

}
