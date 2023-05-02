export default class RegrasRecebimento {
    private tipo: string
    private descricao: string

    constructor(tipo: string, descricao: string){
        this.tipo = tipo
        this.descricao = descricao
    }

    public get getTipo(): string {
        return this.tipo
    }

    public get getDescricao(): string {
        return this.descricao
    }
}