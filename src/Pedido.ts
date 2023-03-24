export default class Pedido { //classe com os atributos de um pedido
    private razao_social:string
    private nome_fantasia:string
    private transportadora:string
    private tipo_frete:string
    private produto_massa:string
    private descricao:string
    private valor_unidade:string
    private valor_total:string
    private data_entrega:Date
    private condicao_pagamento:string




    constructor(razao_social: string,nome_fantasia: string,transportadora:string,tipo_frete:string,produto_massa:string, descricao:string, valor_unidade: string,valor_total: string,data_entrega:Date,condicao_pagamento: string) {
        this.razao_social = razao_social
        this.nome_fantasia = nome_fantasia
        this.transportadora = transportadora
        this.tipo_frete = tipo_frete
        this.produto_massa = produto_massa
        this.descricao = descricao
        this.valor_unidade = valor_unidade
        this.valor_total = valor_total
        this.data_entrega = data_entrega
        this.condicao_pagamento = condicao_pagamento
    }

    get pegarDescricao(){
        return this.descricao
    }
}