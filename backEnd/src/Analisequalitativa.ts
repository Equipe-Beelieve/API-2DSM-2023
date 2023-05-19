export default class AnaliseQualitativa{
    private id?:number
    private tipo: string
    private valor: string
    private avaria?: string
    private codigo:number

    constructor(id: number, codigo:number, tipo: string, valor: string, avaria: string){
        this.id = id
        this.tipo = tipo
        this.valor = valor
        this.avaria = avaria
        this.codigo = codigo
    }
}