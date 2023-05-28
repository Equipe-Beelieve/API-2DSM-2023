import Pedido from "./Pedido.js";

export default class NotaFiscal extends Pedido {
    // private codigo_fornecedor:number
    private codigo_pedido:number
    private codigo_fornecedor:number
    private unidade:string

    constructor(descricao:string, data_pedido:string, data_entrega:string, cnpj:string, valor_unidade:string, produto_massa:string, valor_total:string,  tipo_frete:string, transportadora:string,  condicao_pagamento:string, codigo_fornecedor:number, unidade:string, codigo_pedido:number) {
        super(descricao, data_pedido, data_entrega, cnpj, valor_unidade, produto_massa, valor_total, tipo_frete, transportadora, condicao_pagamento)
        this.codigo_pedido = codigo_pedido
        this.codigo_fornecedor = codigo_fornecedor
        this.unidade = unidade
    }

}


/* export default class NotaFiscal { 
    private razao_social:string
    private codigo_fornecedor:number
    private transportadora:string
    private tipo_frete:string
    private produto_massa:string
    private descricao:string
    private valor_unidade:string
    private valor_total:string
    private data_entrega:string
    private data_emissao:string
    

    constructor(descricao:string, codigo_fornecedor:number, data_emissao:string, data_entrega:string, razao_social:string, valor_unidade:string, produto_massa:string, valor_total:string,  tipo_frete:string, transportadora:string) {
        this.razao_social = razao_social
        this.codigo_fornecedor = codigo_fornecedor
        this.transportadora = transportadora
        this.tipo_frete = tipo_frete
        this.produto_massa = produto_massa
        this.descricao = descricao
        this.valor_unidade = valor_unidade
        this.valor_total = valor_total
        this.data_entrega = data_entrega
        this.data_emissao = data_emissao
    }
} */