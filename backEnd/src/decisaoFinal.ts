import ComparacaoRelatorioFinal from "./ComparaRelatorioFinal";


export default function decisaoFinal(resultados:Array<ComparacaoRelatorioFinal>){
    let decisao = "Aceito"
    resultados.forEach((resultado)=>{
        if(resultado.comparacao !== "Relatório Compras x Nota fiscal | Data do Pedido" 
        && !resultado.comparacao.includes("Regra qualitativa | Análise Quantitativa") 
        && resultado.resultado === false){
            decisao = "Recusado"
        }
    })
    return decisao
}