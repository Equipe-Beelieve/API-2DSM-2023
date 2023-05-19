
import ComparacaoRelatorioFinal from "./ComparaRelatorioFinal"
import RegrasAnalises from "./RegrasAnalises"
import RelatorioFinal from "./RelatorioFinal"
import comparaDados from "./comparaDadosRelatorio"


export default function trataRelatorioFinal(dadosRelatorio:any, regrasAnalise:any, analiseQuantitativa:any){
    
    dadosRelatorio.ped_data_entrega = dadosRelatorio.ped_data_entrega.toString().slice(0, 10)
    dadosRelatorio.ped_data_pedido = dadosRelatorio.ped_data_pedido.toString().slice(0, 10)
    dadosRelatorio.nf_data_emissao = dadosRelatorio.nf_data_emissao.toString().slice(0, 10)
    dadosRelatorio.nf_data_entrega = dadosRelatorio.nf_data_entrega.toString().slice(0, 10)

    let resultado:ComparacaoRelatorioFinal[] = comparaDados(dadosRelatorio, regrasAnalise, analiseQuantitativa)

    let regras:RegrasAnalises[] = []
    regrasAnalise.forEach((regra:any) =>{
        if(regra.av_comentario !== null){
            regras.push({
                tipo:regra.regra_tipo,
                valor:regra.regra_valor,
                regra:regra.regra,
                avaria:regra.av_comentario
            })
        }
        else{
            regras.push({
                tipo:regra.regra_tipo,
                valor:regra.regra_valor,
                regra:regra.regra
            })
        }
    })

    let relatorioFinal:RelatorioFinal = {
        pedido:{
            RazaoSocial:dadosRelatorio.ped_razao_social,
            Transportadora:dadosRelatorio.ped_transportadora,
            TipoFrete:dadosRelatorio.ped_tipo_frete,
            Quantidade:dadosRelatorio.ped_produto_massa,
            Produto:dadosRelatorio.ped_descricao,
            ValorUnitario:dadosRelatorio.ped_valor_unidade,
            ValorTotal:dadosRelatorio.ped_valor_total,
            DataEntrega:dadosRelatorio.ped_data_entrega,
            DataPedido:dadosRelatorio.ped_data_pedido,
            CondicaoPagamento:dadosRelatorio.ped_condicao_pagamento
        },
        notaFiscal:{
            RazaoSocial:dadosRelatorio.nf_razao_social,
            Transportadora:dadosRelatorio.nf_transportadora,
            TipoFrete:dadosRelatorio.nf_tipo_frete,
            Quantidade:dadosRelatorio.nf_produto_massa,
            Produto:dadosRelatorio.nf_produto_descricao,
            ValorUnitario:dadosRelatorio.nf_valor_unidade,
            ValorTotal:dadosRelatorio.nf_valor_total,
            DataEntrega:dadosRelatorio.nf_data_entrega,
            DataPedido:dadosRelatorio.nf_data_emissao,
            CondicaoPagamento:dadosRelatorio.nf_condicao_pagamento,
            Laudo:dadosRelatorio.nf_laudo
        },
        RegrasAnalises:regras,
        Resultados:resultado

    }

    return relatorioFinal
}
