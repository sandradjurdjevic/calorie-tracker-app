export class DnevniUnos {
    id: string;
    ukupnoKalorija: number;
    datum: string;
    idKorisnik: string;

    constructor(id: string, ukupnoKalorija: number, datum: string, idKorisnik: string){
        this.id = id;
        this.ukupnoKalorija=ukupnoKalorija;
        this.datum= datum;
        this.idKorisnik= idKorisnik;
    }
}