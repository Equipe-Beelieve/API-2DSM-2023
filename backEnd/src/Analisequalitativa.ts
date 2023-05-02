import RegrasRecebimento from "./RegrasRecebimento"

export default class AnaliseQualitativa{
    private laudo: string
    private avaria: string
    private umidade: number
    private regras_recebimento: Array<RegrasRecebimento>

    constructor(laudo: string, avaria: string, umidade: number){
        this.laudo = laudo
        this.avaria = avaria
        this.umidade = umidade
        this.regras_recebimento = []
    }

    public get getRegrasRecebimento(): Array<RegrasRecebimento> {
        return this.regras_recebimento
    }
}