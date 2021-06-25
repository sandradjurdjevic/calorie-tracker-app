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
  id:string
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
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        newUser = new User(
          id,
          name,
          lastaname,
          email,
          null
        );
        return this.http.post<{ name: string }>(
          `https://calorie-tracker-6147b-default-rtdb.europe-west1.firebasedatabase.app/users.json?auth=${token}`, newUser);}),
          take(1),
          switchMap((resData)=>{
            generatedId=resData.name;
            return this.user;}),take(1),tap((user)=>{
              newUser.key=generatedId;
              console.log(newUser.key);
              this._user.next(newUser);
            }));//ovde fali auth=${token} posle ? kada sredim uslov za bazu
      
        }


        getCurrentUser() {
          var fetchedUserId;
          return this.authService.userId.pipe(
            take(1),
            switchMap(userId => {
            fetchedUserId = userId;
            return this.authService.token;
          }),
          take(1),
          switchMap((token) => {
              return this.http
                .get<{ [key: string]: UserData }>(
                  `https://calorie-tracker-6147b-default-rtdb.europe-west1.firebasedatabase.app/users.json?auth=${token}`
                );
            }),
            map((UserData: any) => {
              var trazeniuser: User = new User('','','','','') ;
              const users: User[] = [];
              for (const key in UserData) {
                if (UserData.hasOwnProperty(key)) {
                  users.push(new User(UserData[key].id, UserData[key].name, UserData[key].lastname, UserData[key].email, key)
                  );
                }
              }
              console.log(users);
              for(const i in users){
                if(users[i].id===fetchedUserId){
                  trazeniuser.id = users[i].id;
                  trazeniuser.email = users[i].email;
                  trazeniuser.name = users[i].name;trazeniuser.lastname = users[i].lastname;trazeniuser.key = users[i].key;
                }
              }
              console.log(trazeniuser);
              this._user.next(trazeniuser);
              return trazeniuser;
            })
          );
      
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
