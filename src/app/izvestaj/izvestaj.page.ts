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
  isLoading = false;
  public dnevniUnosi: DnevniUnos[]=[];
  idKorisnika: string;

  @ViewChild('barCanvas') private barCanvas: ElementRef;

  barChart: any;
  
  

  

  constructor(private dnevniUnosService: DnevniUnosService,private authService:AuthService) { }

  ngOnInit() {
    console.log("andjela1");
    this.authService.userId.subscribe((id)=>{
      this.idKorisnika = id;
    })
    
console.log(this.idKorisnika);
this.isLoading = false;
  }

   delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
   
}

 async ngAfterViewInit() {
  this.isLoading = true;
  
   console.log("andjela2");

   this.dnevniUnosService.getDnevniUnosi().subscribe((unosi)=>{
    for(const i in unosi){
      if(unosi[i].idKorisnik===this.idKorisnika){
        //console.log("andjela");
       // console.log(unosi[i]);
       // console.log(unosi);
        this.dnevniUnosi.push(unosi[i]);
      }
    }
    console.log(this.dnevniUnosi);
    for(let i = 0; i < this.dnevniUnosi.length; i++){
      console.log(this.dnevniUnosi[i].datum);
    }
    })
    this.isLoading = false;

    await this.delay(1000);
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

  let danasKcal=0;
    let juceKcal=0;
    let dvapreKcal=0;
    let tripreKcal=0;
    let cetiripreKcal=0;
    let petpreKcal=0;
    let sestpreKcal=0;
    this.isLoading = true;
    for(let i = 0; i < this.dnevniUnosi.length; i++){
      if(this.dnevniUnosi[i].datum===danasnjiDatum){
        danasKcal=this.dnevniUnosi[i].ukupnoKalorija;
      }
      if(this.dnevniUnosi[i].datum===juce){
        juceKcal=this.dnevniUnosi[i].ukupnoKalorija;
      }
      if(this.dnevniUnosi[i].datum===dvapre){
        dvapreKcal=this.dnevniUnosi[i].ukupnoKalorija;
      }
      if(this.dnevniUnosi[i].datum===tripre){
        tripreKcal=this.dnevniUnosi[i].ukupnoKalorija;
      }
      if(this.dnevniUnosi[i].datum===cetiripre){
        cetiripreKcal=this.dnevniUnosi[i].ukupnoKalorija;
      }
      if(this.dnevniUnosi[i].datum===petpre){
        petpreKcal=this.dnevniUnosi[i].ukupnoKalorija;
        //console.log(this.dnevniUnosi[i].datum)
      }
      if(this.dnevniUnosi[i].datum===sestpre){
        sestpreKcal=this.dnevniUnosi[i].ukupnoKalorija;
      }else{}
      
    }
    console.log("blablalal");
    this.isLoading = false;
  //treba mi metoda koja izvlaci za taj datum iz dnevni unosi i postavlja na odg poziciju,else 0
    this.barChartMethod(danasnjiDatum,juce,dvapre,tripre,cetiripre,petpre,sestpre,danasKcal,
      juceKcal,dvapreKcal,tripreKcal,cetiripreKcal,petpreKcal,sestpreKcal);
  }

  barChartMethod(danasnjiDatum,juce,dvapre,tripre,cetiripre,petpre,sestpre,danasKcal,
    juceKcal,dvapreKcal,tripreKcal,cetiripreKcal,petpreKcal,sestpreKcal) {
    
    console.log(sestpreKcal);

  
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
