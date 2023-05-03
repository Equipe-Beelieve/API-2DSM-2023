export default class AnaliseQualitativa{
    private tipo: string
    private descricao: string
    private valor: string

    constructor(tipo: string, descricao: string, valor: string){
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }
}