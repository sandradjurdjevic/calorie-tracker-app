export class Recipe {

    constructor(public id: string, public naziv: string, public instrukcije: string,
      public vreme: number, public mode: string, 
                public ukupnoKalorija: number, public ukupnoMasti: number,
                public ukupnoProteina: number,public ukupnoUgljenihHidrata: number,
                public idKorisnik: string) {
    }
  
  }