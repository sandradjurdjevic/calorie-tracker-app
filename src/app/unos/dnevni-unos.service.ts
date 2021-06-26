import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { DnevniUnos } from './dnevni-unos.model';

interface DnevniUnosData{
  id: string;
  ukupnoKalorija: string;
  datum: string;
  idKorisnik: string;
}

@Injectable({
  providedIn: 'root'
})
export class DnevniUnosService {
  private _dnevniUnos = new BehaviorSubject<DnevniUnos>(null);

  constructor(private http: HttpClient, private authService: AuthService) { }

  get dnevniUnos() {
    return this._dnevniUnos.asObservable();
  }

  setDnevniUnos(dnevniUnos: DnevniUnos):void {
    this._dnevniUnos.next(dnevniUnos);
  }

  get unosId() {
    return this._dnevniUnos.asObservable().pipe(
      map((unos) => {
        if (unos) {
          return unos.id;
        } else {
          return null;
        }
      })
    );
  }
  
  addDnevniUnos () {
    let generatedId;
    let newUnos: DnevniUnos = new DnevniUnos(
      null, 0, formatDate(new Date(), 'yyyy-MM-dd', 'en-US'), null
    );
    let fetchedUserId: string;

    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap((token) => {
        newUnos.idKorisnik = fetchedUserId;
        return this.http.post<{ name: string }>(
          `https://calorie-tracker-6147b-default-rtdb.europe-west1.firebasedatabase.app/dnevniUnos.json?auth=${token}`, newUnos);
      }),
      take(1),
      switchMap((resData) => {
        newUnos.id = resData.name;
        return this.dnevniUnos;
      }),
      take(1),
      tap((dnevniUnos) => {
        this._dnevniUnos.next(newUnos);
      })
    
    );
  }

  getDnevniUnosi() {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http
          .get<{ [key: string]: DnevniUnosData }>(
            `https://calorie-tracker-6147b-default-rtdb.europe-west1.firebasedatabase.app/dnevniUnos.json?auth=${token}`
          );
      }),
      map((unosData: any) => {
        console.log(unosData);
        const unosi: DnevniUnos[] = [];
        for (const key in unosData) {
          if (unosData.hasOwnProperty(key)) {
            unosi.push(new DnevniUnos(key, unosData[key].ukupnoKalorija, formatDate(unosData[key].datum, 'yyyy-MM-dd', 'en-US'), unosData[key].idKorisnik)
            );
          }
        }
        return unosi;
        
      })
    );

  }

  editDnevniUnos(id:string, idKorisnik:string, datum:string, ukupnoKalorija:number){
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.put(
          `https://calorie-tracker-6147b-default-rtdb.europe-west1.firebasedatabase.app/dnevniUnos/${id}.json?auth=${token}`,
          {
            id,
            datum,
            idKorisnik,
            ukupnoKalorija
          }
        );
      })
    );
  
  }

  
}
