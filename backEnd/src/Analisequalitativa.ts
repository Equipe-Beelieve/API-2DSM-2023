export default class AnaliseQualitativa{
    private tipo: string
    private valor: string
    private avaria?: string

    constructor(tipo: string, valor: string, avaria: string){
        this.tipo = tipo
        this.valor = valor
        this.avaria = avaria
    }
}