import ComparacaoRelatorioFinal from "./ComparaRelatorioFinal"


export default function comparaDados(dadosRelatorio:any, regrasAnalise:any, analiseQuantitativa:any){
    let comparacoes:ComparacaoRelatorioFinal[] = []

    //=================== Dados do Pesido ===================

    //Relatório Compras x Nota fiscal | Produto
    if (dadosRelatorio.ped_descricao === dadosRelatorio.nf_produto_descricao){
        console.log(`Relatório: ${dadosRelatorio.ped_descricao} | Nota Fiscal: ${dadosRelatorio.nf_produto_descricao}`)
        comparacoes.push({
            
            comparacao:"Relatório Compras x Nota fiscal | Produto",
            resultado:true
        })
    }
    else{
        console.log(`Relatório: ${dadosRelatorio.ped_descricao} | Nota Fiscal: ${dadosRelatorio.nf_produto_descricao}`)
        comparacoes.push({
            comparacao:"Relatório Compras x Nota fiscal | Produto",
            resultado:false
        })
    }
    //Relatório Compras x Nota fiscal | Razão Social
    if(dadosRelatorio.ped_razao_social === dadosRelatorio.nf_razao_social){
        console.log(`Relatório: ${dadosRelatorio.ped_razao_social} | Nota Fiscal: ${dadosRelatorio.nf_razao_social}`)
        comparacoes.push({
            comparacao:"Relatório Compras x Nota fiscal | Razão Social",
            resultado:true
        })
    }
    else{
        console.log(`Relatório: ${dadosRelatorio.ped_razao_social} | Nota Fiscal: ${dadosRelatorio.nf_razao_social}`)
        comparacoes.push({
            comparacao:"Relatório Compras x Nota fiscal | Razão Social",
            resultado:false
        })
    }
    //Relatório Compras x Nota fiscal | Transportadora
    if(dadosRelatorio.ped_transportadora === dadosRelatorio.nf_transportadora){
        console.log(`Relatório: ${dadosRelatorio.ped_transportadora} | Nota Fiscal: ${dadosRelatorio.nf_transportadora}`)
        comparacoes.push({
            comparacao:'Relatório Compras x Nota fiscal | Transportadora',
            resultado: true
        })
    }
    else{
        console.log(`Relatório: ${dadosRelatorio.ped_transportadora} | Nota Fiscal: ${dadosRelatorio.nf_transportadora}`)

        comparacoes.push({
            comparacao:'Relatório Compras x Nota fiscal | Transportadora',
            resultado: false
        })
    }
    //Relatório Compras x Nota fiscal | Valor Unitário
    if(dadosRelatorio.ped_valor_unidade === dadosRelatorio.nf_valor_unidade){
        console.log(`Relatório: ${dadosRelatorio.ped_valor_unidade} | Nota Fiscal: ${dadosRelatorio.nf_valor_unidade}`)

        comparacoes.push({
            comparacao:'Relatório Compras x Nota fiscal | Valor Unidade',
            resultado: true
        })
    }
    else{
        console.log(`Relatório: ${dadosRelatorio.ped_valor_unidade} | Nota Fiscal: ${dadosRelatorio.nf_valor_unidade}`)

        comparacoes.push({
            comparacao:'Relatório Compras x Nota fiscal | Valor Unitário',
            resultado: false
        })
    }
    //Relatório Compras x Nota fiscal | Valor Total
    if(dadosRelatorio.ped_valor_total === dadosRelatorio.nf_valor_total){
        console.log(`Relatório: ${dadosRelatorio.ped_valor_total} | Nota Fiscal: ${dadosRelatorio.nf_valor_total}`)

        comparacoes.push({
            comparacao:'Relatório Compras x Nota fiscal | Valor Total',
            resultado: true
        })
    }
    else{
        console.log(`Relatório: ${dadosRelatorio.ped_valor_total} | Nota Fiscal: ${dadosRelatorio.nf_valor_total}`)

        comparacoes.push({
            comparacao:'Relatório Compras x Nota fiscal | Valor Total',
            resultado: false
        })
    }
    //Relatório Compras x Nota fiscal | Condição de Pagamento
    if(dadosRelatorio.ped_condicao_pagamento === dadosRelatorio.nf_condicao_pagamento){
        console.log(`Relatório: ${dadosRelatorio.ped_condicao_pagamento} | Nota Fiscal: ${dadosRelatorio.nf_condicao_pagamento}`)

        comparacoes.push({
            comparacao:'Relatório Compras x Nota fiscal | Condição de Pagamento',
            resultado: true
        })
    }
    else{
        console.log(`Relatório: ${dadosRelatorio.ped_condicao_pagamento} | Nota Fiscal: ${dadosRelatorio.nf_condicao_pagamento}`)

        comparacoes.push({
            comparacao:'Relatório Compras x Nota fiscal | Condição de Pagamento',
            resultado: false
        })
    }
    //Relatório Compras x Nota fiscal | Tipo Frete
    if(dadosRelatorio.ped_tipo_frete === dadosRelatorio.nf_tipo_frete){
        console.log(`Relatório: ${dadosRelatorio.ped_tipo_frete} | Nota Fiscal: ${dadosRelatorio.nf_tipo_frete}`)

        comparacoes.push({
            comparacao:'Relatório Compras x Nota fiscal | Tipo Frete',
            resultado: true
        })
    }
    else{
        console.log(`Relatório: ${dadosRelatorio.ped_tipo_frete} | Nota Fiscal: ${dadosRelatorio.nf_tipo_frete}`)

        comparacoes.push({
            comparacao:'Relatório Compras x Nota fiscal | Tipo Frete',
            resultado: false
        })
    }
    //Relatório Compras x Nota fiscal | Data do Pedido
    if(dadosRelatorio.ped_data_pedido === dadosRelatorio.nf_data_emissao){
        console.log(`Relatório: ${dadosRelatorio.ped_data_pedido} | Nota Fiscal: ${dadosRelatorio.nf_data_emissao}`)

        comparacoes.push({
            comparacao:'Relatório Compras x Nota fiscal | Data do Pedido',
            resultado: true
        })
    }
    else{
        console.log(`Relatório: ${dadosRelatorio.ped_data_pedido} | Nota Fiscal: ${dadosRelatorio.nf_data_emissao}`)

        comparacoes.push({
            comparacao:'Relatório Compras x Nota fiscal | Data do Pedido',
            resultado: false
        })
    }
    //Relatório Compras x Nota fiscal | Data de Entrega
    if(dadosRelatorio.ped_data_entrega === dadosRelatorio.nf_data_entrega){
        console.log(`Relatório: ${dadosRelatorio.ped_data_entrega} | Nota Fiscal: ${dadosRelatorio.nf_data_entrega}`)

        comparacoes.push({
            comparacao:'Relatório Compras x Nota fiscal | Data de Entrega',
            resultado: true
        })
    }
    else{
        console.log(`Relatório: ${dadosRelatorio.ped_data_entrega} | Nota Fiscal: ${dadosRelatorio.nf_data_entrega}`)

        comparacoes.push({
            comparacao:'Relatório Compras x Nota fiscal | Data de Entrega',
            resultado: false
        })
    }
    //Relatório Compras x Nota fiscal | Quantidade
    if(dadosRelatorio.ped_produto_massa === dadosRelatorio.nf_produto_massa){
        console.log(`Relatório: ${dadosRelatorio.ped_produto_massa} | Nota Fiscal: ${dadosRelatorio.nf_produto_massa}`)

        comparacoes.push({
            comparacao:'Relatório Compras x Nota fiscal | Quantidade',
            resultado: true
        })
    }
    else{
        console.log(`Relatório: ${dadosRelatorio.ped_produto_massa} | Nota Fiscal: ${dadosRelatorio.nf_produto_massa}`)

        comparacoes.push({
            comparacao:'Relatório Compras x Nota fiscal | Quantidade',
            resultado: false
        })
    }

    //=================== Conferência Quantitativa ===================

    //Nota Fiscal x Dados da Análise | Peso
    let pesoMinimo
    let pesoMaximo
    if(dadosRelatorio.nf_produto_massa.slice(-1) === 'g'){
        pesoMinimo = parseFloat(dadosRelatorio.nf_produto_massa.slice(0, -3)) * 0.95
        pesoMaximo = parseFloat(dadosRelatorio.nf_produto_massa.slice(0, -3)) * 1.05
    }
    else{
        pesoMinimo = parseFloat(dadosRelatorio.nf_produto_massa.slice(0, -2)) * 0.95
        pesoMaximo = parseFloat(dadosRelatorio.nf_produto_massa.slice(0, -2)) * 1.05
    }
    let valor = analiseQuantitativa.regra_valor
    
    if(valor.slice(-1) === 'g'){
        valor = parseFloat(valor.slice(0, -3))
    }
    else{
        valor = parseFloat(valor.slice(0, -2))
    }
    if(pesoMinimo <= valor && pesoMaximo >= valor){
        console.log(`QUANTITATIVA ----------------- nf: ${dadosRelatorio.nf_produto_massa} | Mínimo:${pesoMinimo} | Máximo:${pesoMaximo}`)
        comparacoes.push({
            comparacao:'Nota Fiscal x Dados da Análise Quantitativa | Peso',
            resultado: true
        })
    }
    else{
        comparacoes.push({
            comparacao:'Nota Fiscal x Dados da Análise Quantitativa | Peso',
            resultado: false
        })
    }

    //=================== Conferência Qualitativa ===================

    //laudo
    console.log(`======= Laudo =======\n\n\n`)
    console.log(dadosRelatorio.nf_laudo)
    console.log(`=====================\n\n\n`)
    if(dadosRelatorio.nf_laudo === 'sim'){
        comparacoes.push({
            comparacao:`Laudo`,
            resultado: true
        })
    }
    else{
        comparacoes.push({
            comparacao:`Laudo`,
            resultado: false
        })
    }


    regrasAnalise.forEach((analise:any) => {
        if(analise.regra_tipo === 'Pureza'){
            let regra = parseFloat(analise.regra.slice(1, -1))
            let valor = parseFloat(analise.regra_valor.slice(0, -1))
            console.log(`PUREZA ---------- regra:${regra} | valor:${valor}`)
            if(valor>regra){
                comparacoes.push({
                    comparacao:`Regra qualitativa | ${analise.regra_tipo} | ${analise.regra}`,
                    resultado: true
                })
            }
            else{
                comparacoes.push({
                    comparacao:`Regra qualitativa | ${analise.regra_tipo} | ${analise.regra}`,
                    resultado: false
                })
            }
        }
        else if(analise.regra_tipo === 'Umidade'){
            let regra = parseFloat(analise.regra.slice(1, -1))
            let valor = parseFloat(analise.regra_valor.slice(0, -1))
            console.log(`UMIDADE ---------- regra:${regra} | valor:${valor}`)
            if(valor<regra){
                comparacoes.push({
                    comparacao:`Regra qualitativa | ${analise.regra_tipo} | ${analise.regra}`,
                    resultado: true
                })
            }
            else{
                comparacoes.push({
                    comparacao:`Regra qualitativa | ${analise.regra_tipo} | ${analise.regra}`,
                    resultado: false
                })
            }
        }
        else{
            console.log(`${analise.regra_tipo} ---------- regra:${analise.regra} | valor:${analise.regra_valor}`)
            if(analise.regra_valor === 'true'){
                comparacoes.push({
                    comparacao:`Regra qualitativa | ${analise.regra_tipo} | ${analise.regra}`,
                    resultado: true
                })
            }
            else{
                comparacoes.push({
                    comparacao:`Regra qualitativa | ${analise.regra_tipo} | ${analise.regra}`,
                    resultado: false
                })
            }
                
            
        }

    })
    comparacoes.forEach((resultado) =>{
        console.log(resultado)
    })
        
    return comparacoes
}

