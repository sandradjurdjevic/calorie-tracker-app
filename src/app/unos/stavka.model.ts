
export class Stavka {
    idDnevnogUnosa: string;
    redniBroj: string;
    kalorija: number;
    masti: number;
    ugljenihHidrata: number;
    proteina: number;
    kolicina: number;
    idFood: string;
    idRecept: string;

    constructor(redniBroj: string, kalorija: number, 
        masti: number, ugljenihHidrata: number,proteina: number,kolicina: number, 
        idFood: string, idRecept: string, idDnevnogUnosa: string,){
            this.idDnevnogUnosa= idDnevnogUnosa;
            this.redniBroj= redniBroj;
            this.kalorija= kalorija;
            this.masti= masti;
            this.ugljenihHidrata= ugljenihHidrata;
            this.proteina= proteina;
            this.kolicina= kolicina;
            this.idFood= idFood;
            this.idRecept= idRecept;
    }
}