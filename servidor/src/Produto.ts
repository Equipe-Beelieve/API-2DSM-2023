export default class Produto {
    descricao:string 
    unidade_medida:string

    constructor(descricao:string, unidade_medida:string) {
        this.descricao = descricao
        this.unidade_medida = unidade_medida
    }
}