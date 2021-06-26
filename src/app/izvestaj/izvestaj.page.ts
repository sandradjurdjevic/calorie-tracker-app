import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { formatDate } from '@angular/common';
import { DnevniUnosService } from '../unos/dnevni-unos.service';
import { DnevniUnos } from '../unos/dnevni-unos.model';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-izvestaj',
  templateUrl: './izvestaj.page.html',
  styleUrls: ['./izvestaj.page.scss'],
})
export class IzvestajPage implements OnInit {
 
  public dnevniUnosi: DnevniUnos[]=[];
  idKorisnika: string;

  @ViewChild('barCanvas') private barCanvas: ElementRef;

  barChart: any;
  
  

  

  constructor(private dnevniUnosService: DnevniUnosService,private authService:AuthService) { }

  ngOnInit() {
    this.authService.userId.subscribe((id)=>{
      this.idKorisnika = id;
    })
console.log(this.idKorisnika);
    this.dnevniUnosService.getDnevniUnosi().subscribe((unosi)=>{
      for(const i in unosi){
        if(unosi[i].idKorisnik===this.idKorisnika){
          console.log("andjela");
          console.log(unosi[i]);
          console.log(unosi);
          this.dnevniUnosi.push(unosi[i]);
        }
      }
      })
    
  }

 ngAfterViewInit() {
  let danasnjiDatum =formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
  var myPastDate=new Date(danasnjiDatum);
  myPastDate.setDate(myPastDate.getDate() - 1);
  let juce=formatDate(myPastDate, 'yyyy-MM-dd', 'en-US');
  var myPastDate=new Date(danasnjiDatum);
  myPastDate.setDate(myPastDate.getDate() - 2);
  let dvapre=formatDate(myPastDate, 'yyyy-MM-dd', 'en-US');
  var myPastDate=new Date(danasnjiDatum);
  myPastDate.setDate(myPastDate.getDate() - 3);
  let tripre=formatDate(myPastDate, 'yyyy-MM-dd', 'en-US');
  var myPastDate=new Date(danasnjiDatum);
  myPastDate.setDate(myPastDate.getDate() - 4);
  let cetiripre=formatDate(myPastDate, 'yyyy-MM-dd', 'en-US');
  var myPastDate=new Date(danasnjiDatum);
  myPastDate.setDate(myPastDate.getDate() - 5);
  let petpre=formatDate(myPastDate, 'yyyy-MM-dd', 'en-US');
  var myPastDate=new Date(danasnjiDatum);
  myPastDate.setDate(myPastDate.getDate() - 6);
  let sestpre=formatDate(myPastDate, 'yyyy-MM-dd', 'en-US');
  var myPastDate=new Date(danasnjiDatum);
  myPastDate.setDate(myPastDate.getDate() - 7);
  let sedampre=formatDate(myPastDate, 'yyyy-MM-dd', 'en-US');

  //treba mi metoda koja izvlaci za taj datum iz dnevni unosi i postavlja na odg poziciju,else 0
    this.barChartMethod(danasnjiDatum,juce,dvapre,tripre,cetiripre,petpre,sestpre);
  }

  barChartMethod(danasnjiDatum,juce,dvapre,tripre,cetiripre,petpre,sestpre) {
    let danasKcal;
    let juceKcal;
    let dvapreKcal;
    let tripreKcal;
    let cetiripreKcal;
    let petpreKcal;
    let sestpreKcal;
    for(const i in this.dnevniUnosi){
      if(this.dnevniUnosi[i].datum===danasnjiDatum){
        danasKcal=this.dnevniUnosi[i].ukupnoKalorija
      }else{danasKcal=0}
    }
    for(const i in this.dnevniUnosi){
      if(this.dnevniUnosi[i].datum===juce){
        juceKcal=this.dnevniUnosi[i].ukupnoKalorija
      }else{juceKcal=0}
    }
    for(const i in this.dnevniUnosi){
      if(this.dnevniUnosi[i].datum===dvapre){
        dvapreKcal=this.dnevniUnosi[i].ukupnoKalorija
      }else{dvapreKcal=0}
    }
    for(const i in this.dnevniUnosi){
      if(this.dnevniUnosi[i].datum===tripre){
        tripreKcal=this.dnevniUnosi[i].ukupnoKalorija
      }else{tripreKcal=0}
    }for(const i in this.dnevniUnosi){
      if(this.dnevniUnosi[i].datum===cetiripre){
        cetiripreKcal=this.dnevniUnosi[i].ukupnoKalorija
      }else{cetiripreKcal=0}
    }for(const i in this.dnevniUnosi){
      if(this.dnevniUnosi[i].datum===petpre){
        petpreKcal=this.dnevniUnosi[i].ukupnoKalorija
      }else{petpreKcal=0}
    }for(const i in this.dnevniUnosi){
      if(this.dnevniUnosi[i].datum===sestpre){
        sestpreKcal=this.dnevniUnosi[i].ukupnoKalorija
      }else{sestpreKcal=0}
    }

    //console.log(myPastDate);
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: [danasnjiDatum, juce,dvapre, tripre,cetiripre,petpre,sestpre],
        datasets: [
          {
            label: 'Unos kalorija poslednjih 7 dana',
            fill: false,
            backgroundColor: '#b10606',
            borderColor: '#b10606',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
           
            data: [danasKcal, juceKcal, dvapreKcal, tripreKcal, cetiripreKcal,petpreKcal, sestpreKcal],
            spanGaps: false,
          }
        ]
      }
    });
  }


}
