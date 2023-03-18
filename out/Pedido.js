export default class Pedido {
    constructor(fornecedor, transportadora, tipo_frete, produto_massa, descricao, data_entrega, nota_fiscal) {
        this.fornecedor = fornecedor;
        this.transportadora = transportadora;
        this.tipo_frete = tipo_frete;
        this.produto_massa = produto_massa;
        this.descricao = descricao;
        this.data_entrega = data_entrega;
        this.nota_fiscal = nota_fiscal;
    }
}
