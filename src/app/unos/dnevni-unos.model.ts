export class DnevniUnos {
    id: string;
    ukupnoKalorija: string;
    datum: string;
    idKorisnik: string;

    constructor(id: string, ukupnoKalorija: string, datum: string, idKorisnik: string){
        this.id = id;
        this.ukupnoKalorija=ukupnoKalorija;
        this.datum= datum;
        this.idKorisnik= idKorisnik;
    }
}