export class Food {
    id: string;
    naziv: string;
    kalorije100g: number;
    masti100g: number;
    proteini100g: number;
    ugljeniHidrati100g: number;

    constructor(id: string, naziv: string, kalorije100g: number, masti100g: number, proteini100g: number, ugljeniHidrati100g: number){
        this.id=id;
        this.naziv=naziv;
        this.kalorije100g=kalorije100g;
        this.masti100g=masti100g;
        this.proteini100g=proteini100g;
        this.ugljeniHidrati100g=ugljeniHidrati100g;
    }
}
