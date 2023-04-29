export default class Pedido { //classe com os atributos de um pedido
    private razao_social:string
    private transportadora:string
    private tipo_frete:string
    private produto_massa:string
    private descricao:string
    private valor_unidade:string
    private valor_total:string
    private data_entrega:string
    private data_pedido:string
    private condicao_pagamento:string
    private status = "A caminho"

    constructor(descricao:string, data_pedido:string, data_entrega:string, razao_social:string, valor_unidade:string, produto_massa:string, valor_total:string,  tipo_frete:string, transportadora:string,  condicao_pagamento:string) {
        this.razao_social = razao_social
        this.transportadora = transportadora
        this.tipo_frete = tipo_frete
        this.produto_massa = produto_massa
        this.descricao = descricao
        this.valor_unidade = valor_unidade
        this.valor_total = valor_total
        this.data_entrega = data_entrega
        this.condicao_pagamento = condicao_pagamento
        this.data_pedido = data_pedido
    }

    get pegarDescricao(){
        return this.descricao
    }
    public set mudarStatus(valor: string){
        this.status = valor
    }
}