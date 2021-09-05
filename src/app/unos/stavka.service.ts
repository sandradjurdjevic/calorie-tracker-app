import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { DnevniUnosService } from './dnevni-unos.service';
import { Stavka } from './stavka.model';

interface StavkaData {
  idDnevnogUnosa: string;
  redniBroj: string;
  naziv: string;
  kalorija: number;
  masti: number;
  ugljenihHidrata: number;
  proteina: number;
  kolicina: number;
  idFood: string;
  idRecept: string;
}

@Injectable({
  providedIn: 'root'
})
export class StavkaService {
  private _stavkePretraga = new BehaviorSubject<Stavka[]>([]);

  constructor(private http: HttpClient, private authService: AuthService, private unosService: DnevniUnosService) { }

  get stavkePretraga() {
    return this._stavkePretraga.asObservable();
  }

  getStavke() {
    let dnevniUnosID;
    return this.unosService.unosId.pipe(
      take(1),
      switchMap((unosID)=>{
        dnevniUnosID = unosID;
        return this.authService.token
      }),
      take(1),
      switchMap((token) => {
        return this.http
          .get<{ [key: string]: StavkaData }>(
            `https://calorie-tracker-6147b-default-rtdb.europe-west1.firebasedatabase.app/stavka.json?auth=${token}`
          );
      }),
      map((stavke: any) => {
        console.log(stavke);
        const sveStavke: Stavka[] = [];
        for (const key in stavke) {
          if (stavke.hasOwnProperty(key) && stavke[key].idDnevnogUnosa==dnevniUnosID) {
            sveStavke.push(new Stavka(key, stavke[key].naziv, stavke[key].kalorija, stavke[key].masti, stavke[key].ugljenihHidrata, stavke[key].proteina, stavke[key].kolicina, stavke[key].mernaJedinica, stavke[key].idFood, stavke[key].idRecept, stavke[key].idDnevnogUnosa)
            );
          }
        }
          return sveStavke;
      }), take(1),
      tap((sveStavke)=>{
        if(sveStavke.length > 0){
          this._stavkePretraga.next(sveStavke);
        }else{
          this._stavkePretraga.next([]);
        }
      })
    )
  }

  addStavka (naziv:string, kalorija:number, masti:number, ugljenihHidrata:number, proteina:number, kolicina:number, mernaJedinica:string, idFood:string, idRecept:string) {
    let idDnevnogUnosa;
    /*this.unosService.dnevniUnos.subscribe((unos)=>{
      idDnevnogUnosa = unos.id; 
    })*/
    let newStavka: Stavka = new Stavka(
      null, naziv, kalorija, masti, ugljenihHidrata, proteina, kolicina, mernaJedinica, idFood, idRecept, null
    );

    return this.unosService.unosId.pipe(
      take(1),
      switchMap(idUnosa => {
        console.log(idUnosa);
        idDnevnogUnosa = idUnosa;
        return this.authService.token;
      }),
        take(1),
        switchMap((token) => {
          newStavka.idDnevnogUnosa = idDnevnogUnosa;
          return this.http.post<{ name: string }>(
            `https://calorie-tracker-6147b-default-rtdb.europe-west1.firebasedatabase.app/stavka.json?auth=${token}`, newStavka);
        }),
        take(1),
        switchMap((resData) => {
          newStavka.redniBroj = resData.name;
          return this.stavkePretraga;
        }),
        take(1),
        tap((stavkePretraga) => {
          this._stavkePretraga.next(stavkePretraga.concat(newStavka));
        })
        
        );
  }
    
  editStavka (redniBroj: string, naziv: string, kalorija:number, masti:number, ugljenihHidrata:number, proteina:number, kolicina:number, mernaJedinica:string, idFood:string, idRecept:string) {
    let idDnevnogUnosa;
    return this.unosService.unosId.pipe(
      take(1),
      switchMap(idUnosa => {
        console.log(idUnosa);
        idDnevnogUnosa = idUnosa;
        return this.authService.token;
      }),
      take(1),
      switchMap((token) => {
        return this.http.put(
          `https://calorie-tracker-6147b-default-rtdb.europe-west1.firebasedatabase.app/stavka/${redniBroj}.json?auth=${token}`,
          {
            idDnevnogUnosa,
            idFood,
            naziv,
            kalorija,
            kolicina, 
            masti, 
            mernaJedinica,
            proteina,
            ugljenihHidrata
          }
        );
      }),
      switchMap(() => {
        return this.stavkePretraga;
      }),
      take(1),
      tap((stavke) => {
        const updatedStavkaIndex = stavke.findIndex((q) => q.redniBroj === redniBroj);
        const updatedStavke = [...stavke];
        updatedStavke[updatedStavkaIndex] = new Stavka(
          redniBroj,
          naziv,
          kalorija,
          masti, 
          proteina,
          ugljenihHidrata,
          kolicina, 
          mernaJedinica,
          idFood,
          idRecept,
          idDnevnogUnosa,
        );
        this._stavkePretraga.next(updatedStavke);
      })
    );
  
  }

}

