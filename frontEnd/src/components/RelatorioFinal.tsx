import {useState, useEffect} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../services/api'
import NavBar from './NavBar'
import verificaLogado from '../funcoes/verificaLogado'

interface Regras {
    tipo: string,
    valor: string,
    regra: string,
    avaria?: string
}

interface Resultado {
    comparacao: string,
    resultado: boolean
}

interface Relatorio {
        RegrasAnalises: Regras[]
        Resultados: Resultado[]
        notaFiscal: {
            CondicaoPagamento: string,
            DataEntrega: string,
            DataPedido: string,
            Laudo: string,
            Produto: string,
            Quantidade: string,
            RazaoSocial: string,
            TipoFrete: string,
            Transportadora: string,
            ValorTotal: string,
            ValorUnitario: string
        }
        pedido: {
            CondicaoPagamento: string,
            DataEntrega: string,
            DataPedido: string,
            Produto: string,
            Quantidade: string,
            RazaoSocial: string,
            TipoFrete: string,
            Transportadora: string,
            ValorTotal: string,
            ValorUnitario: string
        }
}


function RelatorioFinal() {
    const [dadosRelatorio, setDadosRelatorio] = useState<Relatorio>({RegrasAnalises: [], Resultados: [], notaFiscal:{...Object.assign({})}, pedido:{...Object.assign({})}})
    const [resultadoFinal, setResultadoFinal] = useState(true)
    const [funcao, setFuncao] = useState('')
    const navigate = useNavigate()
    const {id} = useParams()

    async function getDadosRelatorio(){
        try {
            await api.post("/relatorioFinal", {id}).then((resposta) => {
                let dados = resposta.data
                setDadosRelatorio(dados)
                console.log(dados)

                const comparacoes = dados.Resultados
                for(let i = 0; comparacoes.length; i++){
                    if(comparacoes[i].resultado === false){
                        setResultadoFinal(false)
                    }
                }
            })
        } 
        catch (erro) {
            console.log(erro)
        }
    }

    function navigateTo(caminho:string){
        navigate(`/${caminho}`)
    }

    useEffect(() => {
        async function veLogado() {
            const resultado = await verificaLogado()
            if(resultado.logado === true){
                setFuncao(resultado.funcao)
            } else {
                navigate("/")
            }
        }
        veLogado()
        getDadosRelatorio()
    }, [])

    return(
        <>
        <NavBar/>
            <h1 className='mainTitle'>Relatório Final</h1>
            <form>
                <h2 className='mainTitle' >Dados do Pedido</h2>
                <h3>Relatório de Compras</h3> <h3>Dados da Nota Fiscal</h3>
                {dadosRelatorio.Resultados.map((resultado, index) => {
                    if(resultado.comparacao === 'Relatório Compras x Nota fiscal | Produto'){
                        return (
                            <div className={`${resultado.resultado === true? 'boxFinalReportGreen' : 'boxFinalReportRed'}`}>
                                <label>Produto</label>
                                <input type="text" value={dadosRelatorio.pedido.Produto} readOnly/> <input type="text" value={dadosRelatorio.notaFiscal.Produto} readOnly/>
                            </div>
                        )
                    }
                    else if(resultado.comparacao === 'Relatório Compras x Nota fiscal | Razão Social'){
                        return (
                            <div className={`${resultado.resultado === true? 'boxFinalReportGreen' : 'boxFinalReportRed'}`}>
                                <label >Razão Social</label>
                                <input type="text" value={dadosRelatorio.pedido.RazaoSocial} readOnly/> <input type="text" value={dadosRelatorio.notaFiscal.RazaoSocial} readOnly/>
                            </div>
                        )
                    }
                    else if(resultado.comparacao === 'Relatório Compras x Nota fiscal | Transportadora'){
                        return (
                            <div className={`${resultado.resultado === true? 'boxFinalReportGreen' : 'boxFinalReportRed'}`} >
                                <label>Transportadora</label>
                                <input type="text" value={dadosRelatorio.pedido.Transportadora} readOnly/> <input type="text" value={dadosRelatorio.notaFiscal.Transportadora} readOnly/>
                            </div>  
                        )
                    }
                    else if(resultado.comparacao === 'Relatório Compras x Nota fiscal | Valor Unidade'){
                        return (
                            <div className={`${resultado.resultado === true? 'boxFinalReportGreen' : 'boxFinalReportRed'}`}>
                                <label>Valor Unitário</label>
                                <input type="text" value={dadosRelatorio.pedido.ValorUnitario} readOnly/> <input type="text" value={dadosRelatorio.notaFiscal.ValorUnitario} readOnly/>
                            </div>      
                        )
                    } else if(resultado.comparacao === 'Relatório Compras x Nota fiscal | Valor Total'){
                        return (
                            <div className={`${resultado.resultado === true? 'boxFinalReportGreen' : 'boxFinalReportRed'}`}>
                                <label>Valor Total</label>
                                <input type="text" value={dadosRelatorio.pedido.ValorTotal} readOnly/> <input type="text" value={dadosRelatorio.notaFiscal.ValorTotal} readOnly/>
                            </div>
                        )
                    } else if(resultado.comparacao === 'Relatório Compras x Nota fiscal | Condição de Pagamento'){
                        return (
                            <div className={`${resultado.resultado === true? 'boxFinalReportGreen' : 'boxFinalReportRed'}`}>
                                <label>Condição de Pagamento</label>
                                <input type="text" value={dadosRelatorio.pedido.CondicaoPagamento} readOnly/> <input type="text" value={dadosRelatorio.notaFiscal.CondicaoPagamento} readOnly/>
                            </div>
                        )
                    } else if(resultado.comparacao === 'Relatório Compras x Nota fiscal | Tipo Frete'){
                        return (
                            <div className={`${resultado.resultado === true? 'boxFinalReportGreen' : 'boxFinalReportRed'}`}>
                                <label>Tipo de Frete</label>
                                <input type="text" value={dadosRelatorio.pedido.TipoFrete} readOnly/> <input type="text" value={dadosRelatorio.notaFiscal.TipoFrete} readOnly/>
                            </div>
                        )
                    } else if(resultado.comparacao === 'Relatório Compras x Nota fiscal | Data do Pedido'){
                        return (
                            <div className={`${resultado.resultado === true? 'boxFinalReportGreen' : 'boxFinalReportRed'}`}>
                                <label>Data do Pedido</label>
                                <input type="text" value={dadosRelatorio.pedido.DataPedido} readOnly/> <input type="text" value={dadosRelatorio.notaFiscal.DataPedido} readOnly/>
                            </div>
                        )
                    } else if(resultado.comparacao === 'Relatório Compras x Nota fiscal | Data de Entrega'){
                        return (
                            <div className={`${resultado.resultado === true? 'boxFinalReportGreen' : 'boxFinalReportRed'}`}>
                                <label>Data de entrega</label>
                                <input type="text" value={dadosRelatorio.pedido.DataEntrega} readOnly/> <input type="text" value={dadosRelatorio.notaFiscal.DataEntrega} readOnly/>
                            </div>
                        )
                    } else if(resultado.comparacao === 'Relatório Compras x Nota fiscal | Quantidade'){
                        return (
                            <div className={`${resultado.resultado === true? 'boxFinalReportGreen' : 'boxFinalReportRed'}`}>
                                <label>Quantidade</label>
                                <input type="text" value={dadosRelatorio.pedido.Quantidade} readOnly/> <input type="text" value={dadosRelatorio.notaFiscal.Quantidade} readOnly/>
                            </div>
                        )
                    }
                })}
            
                <h2>Conferência Quantitativa</h2>
                <h3>Dados da Nota Fiscal</h3> <h3>Dados da análise</h3>
                    {dadosRelatorio.RegrasAnalises.map((regra, index) => {
                        const analiseQuantitativa = dadosRelatorio.Resultados.find((resultado) => resultado.comparacao === 'Nota Fiscal x Dados da Análise Quantitativa | Peso')
                            if(regra.tipo === 'Análise Quantitativa'){
                                return (
                                    <div className={`${analiseQuantitativa?.resultado === true? 'boxFinalReportGreen' : 'boxFinalReportRed'}`}>
                                        <label>Peso</label>
                                        <input type="text" value={regra.regra} readOnly/> <input type="text" value={regra.valor} readOnly/>
                                    </div>
                                )
                            }
                        })}
                
                <h2>Conferência Qualitativa</h2>
                <h3>Regra de Recebimento</h3> <h3>Dados da análise</h3>
                {dadosRelatorio.Resultados.map((resultado, index) => {
                    if(resultado.comparacao === 'Laudo'){
                        return (
                            <div className={`${resultado.resultado === true? 'boxFinalReportGreen' : 'boxFinalReportRed'}`}>
                                <label>Presença do laudo</label>
                                <input type="text" value={'Sim'} readOnly/> <input type="text" value={dadosRelatorio.notaFiscal.Laudo} readOnly/>
                            </div>
                        )
                    }   
                })}
                    {dadosRelatorio.RegrasAnalises.map((regra, index) => {
                        if(regra.tipo === 'Personalizada'){
                            const resultadoPersonalizada = dadosRelatorio.Resultados.find((resultado) => resultado.comparacao === `Regra qualitativa | Personalizada | ${regra.regra}`)
                            return(
                                <div className={`${resultadoPersonalizada?.resultado === true? 'boxFinalReportGreen' : 'boxFinalReportRed'}`}>
                                    <label>{regra.regra}</label>
                                    <input type="text" value={'Sim'} readOnly/> <input type="text" value={regra.valor === 'true'? 'Sim' : 'Não'} readOnly/>
                                </div>
                            )
                        } else if(regra.tipo === 'Avaria'){
                            const resultadoAvaria = dadosRelatorio.Resultados.find((resultado) => resultado.comparacao === 'Regra qualitativa | Avaria | Não deve haver')
                            return(
                                <div className={`${resultadoAvaria?.resultado === true? 'boxFinalReportGreen' : 'boxFinalReportRed'}`}>
                                    <label>Avaria</label>
                                    <input type="text" value={'Não deve haver'} readOnly/> <input type="text" value={regra.valor === 'true'? 'Não há' : 'Há'} readOnly/>
                                    {regra.avaria !== undefined && regra.avaria !== '' &&
                                        <input type="text" value={regra.avaria} readOnly/>
                                    }
                                   
                                </div>
                            )
                        } else {
                            const resultadoAnalise = dadosRelatorio.Resultados.find((resultado) => resultado.comparacao === `Regra qualitativa | ${regra.tipo} | ${regra.regra}`)
                            return(
                                <div className={`${resultadoAnalise?.resultado === true? 'boxFinalReportGreen' : 'boxFinalReportRed'}`}>
                                    <label>{regra.tipo}</label>
                                    <input type="text" value={regra.regra} readOnly/> <input type="text" value={regra.valor} readOnly/>
                                </div>
                            )
                        }
                    })}
                    {resultadoFinal === true &&
                        <>
                            <div>
                                <p>APROVADO</p>
                            </div> 
                            <div>
                                <button onClick={(e) => navigateTo('listaPedidos')}>Outros pedidos</button>
                            </div>
                        </> 
                    }
                    {resultadoFinal === false &&
                        <>
                            <div>
                                <p>RECUSADO</p>
                            </div> 
                            <div>
                                <button onClick={(e) => navigateTo('listaPedidos')}>Outros pedidos</button>
                                {(funcao === 'Administrador' || funcao === 'Gerente') &&
                                    <>
                                        <button>Forçar aceite</button>
                                    </>
                                } 
                            </div>
                        </> 
                    }    
            </form>
            
        </>
    )
}

export default RelatorioFinal