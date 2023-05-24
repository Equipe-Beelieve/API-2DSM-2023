

import ComparacaoRelatorioFinal from "./ComparaRelatorioFinal"
import RegrasAnalises from "./RegrasAnalises"


export default interface RelatorioFinal {
    // Valores da tabela Pedido
    pedido:{
        RazaoSocial:string
        Transportadora:string
        TipoFrete:string
        Quantidade:string
        Produto:string
        ValorUnitario:string
        ValorTotal:string
        DataEntrega:string
        DataPedido:string
        CondicaoPagamento:string
    }
    
    // Valores da tabela Nota Fiscal
    notaFiscal:{
        RazaoSocial:string
        Transportadora:string
        TipoFrete:string
        Quantidade:string
        Produto:string
        ValorUnitario:string
        ValorTotal:string
        DataEntrega:string
        DataPedido:string
        CondicaoPagamento:string
        Laudo:string
    }

    // Valores da tabela Parametros do Pedido e regra de negócio
    RegrasAnalises:RegrasAnalises[]

    Resultados:ComparacaoRelatorioFinal[]

    DecisaoFinal:string
}