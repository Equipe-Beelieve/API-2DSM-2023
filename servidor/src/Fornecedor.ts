import Endereco from "./Endereco"

export default class Fornecedor {
    private cnpj:string
    private endereco:Endereco
    private razao_social:string
    private nome_fantasia:string

    constructor(cnpj:string, endereco:Endereco, razao_social:string, nome_fantasia:string) {
        this.cnpj = cnpj
        this.endereco = endereco
        this.razao_social = razao_social
        this.nome_fantasia = nome_fantasia
    }

}