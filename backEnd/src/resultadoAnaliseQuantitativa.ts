

export default function resultadoAnaliseQuantitativa(analise:string, nf_produto_massa:string){
    
    let resultado = {
        tipo:"Análise Quantitativa",
        valor:analise,
        regra:nf_produto_massa,
        resultado:false
    }

    let pesoMinimo
    let pesoMaximo
    if(nf_produto_massa.slice(-1) === 'g'){
        pesoMinimo = parseFloat(nf_produto_massa.slice(0, -3)) * 0.95
        pesoMaximo = parseFloat(nf_produto_massa.slice(0, -3)) * 1.05
    }
    else{
        pesoMinimo = parseFloat(nf_produto_massa.slice(0, -2)) * 0.95
        pesoMaximo = parseFloat(nf_produto_massa.slice(0, -2)) * 1.05
    }
    let valor
    
    if(analise.slice(-1) === 'g'){
        valor = parseFloat(analise.slice(0, -3))
    }
    else{
        valor = parseFloat(analise.slice(0, -2))
    }
    if(pesoMinimo <= valor && pesoMaximo >= valor){
        
        resultado.resultado = true
    }
    return resultado
}