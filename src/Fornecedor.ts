import Endereco from "./Endereco"

export default class Fornecedor {
    private nome:string
    private cnpj:string
    private endereco:Endereco
    private razao_social:string
    private nome_fantasia:string

    constructor(nome:string, cnpj:string, endereco:Endereco, razao_social:string, nome_fantasia:string) {
        this.nome = nome
        this.cnpj = cnpj
        this.endereco = endereco
        this.razao_social = razao_social
        this.nome_fantasia = nome_fantasia
    }

}