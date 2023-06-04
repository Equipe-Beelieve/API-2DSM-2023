

export default function resultadoAnaliseQualitativa(objeto:any){
    let analise = {
        regra_tipo: objeto.regra_tipo,
        regra_valor: objeto.regra_valor,
        regra: objeto.regra,
        av_comentario: objeto.av_comentario,
        resultado:false
    }

    //=================== Conferência Qualitativa ===================

    if(analise.regra_tipo === 'Pureza'){
        let regra = parseFloat(analise.regra.slice(1, -1))
        let valor = parseFloat(analise.regra_valor.slice(0, -1))
        if(valor>regra){analise.resultado = true}
    }
    else if(analise.regra_tipo === 'Umidade'){
        let regra = parseFloat(analise.regra.slice(1, -1))
        let valor = parseFloat(analise.regra_valor.slice(0, -1))
        if(valor<regra){analise.resultado = true}
    }
    else{
       
        if(analise.regra_valor === 'true'){analise.resultado = true}
    }    
    return analise
}