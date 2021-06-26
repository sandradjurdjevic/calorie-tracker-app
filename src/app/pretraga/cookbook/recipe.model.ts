export class Recipe {

    constructor(public id: string, public naziv: string, public opis: string,
                public ukupnoKalorija: number, public ukupnoMasti: number,
                public ukupnoProteina: number,public ukupnoUgljenihHidrata: number,
                public idKorisnik: string) {
    }
  
  }