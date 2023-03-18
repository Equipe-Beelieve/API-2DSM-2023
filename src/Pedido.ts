export default class Pedido { //classe com os atributos de um pedido (me baseei nos scripts do banco)
    private fornecedor:string
    private transportadora:string
    private tipo_frete:string
    private produto_massa:string
    private descricao:string
    private data_entrega:Date
    private nota_fiscal:number

    constructor(fornecedor:string, transportadora:string, tipo_frete:string, produto_massa:string, descricao:string, data_entrega:Date, nota_fiscal:number) {
        this.fornecedor = fornecedor
        this.transportadora = transportadora
        this.tipo_frete = tipo_frete
        this.produto_massa = produto_massa
        this.descricao = descricao
        this.data_entrega = data_entrega
        this.nota_fiscal = nota_fiscal
    }

    get pegarDescricao(){
        return this.descricao
    }
}