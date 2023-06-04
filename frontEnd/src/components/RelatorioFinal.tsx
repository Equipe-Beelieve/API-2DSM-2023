import { useState, useEffect } from 'react'
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
        CNPJ: string,
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
        CNPJ: string,
        TipoFrete: string,
        Transportadora: string,
        ValorTotal: string,
        ValorUnitario: string
    }
}


function RelatorioFinal() {
    const [dadosRelatorio, setDadosRelatorio] = useState<Relatorio>({ RegrasAnalises: [], Resultados: [], notaFiscal: { ...Object.assign({}) }, pedido: { ...Object.assign({}) } })
    const [resultadoFinal, setResultadoFinal] = useState('')
    const [funcao, setFuncao] = useState('')
    const navigate = useNavigate()
    const { id } = useParams()
    const [controleRender, setControleRender] = useState(false)

    async function getDadosRelatorio() {
        try {
            await api.get(`/relatorioFinal/${id}`).then((resposta) => {
                let dados = resposta.data
                setDadosRelatorio(dados)
                setResultadoFinal(dados.DecisaoFinal)
                console.log(dados)
            })
        }
        catch (erro) {
            console.log(erro)
        }
    }

    function navigateTo(caminho: string) {
        navigate(`/${caminho}`)
    }

    async function forcarAceite() {
        setResultadoFinal('Aceito')
        await api.post('/forcarAceite', { status: 'Aceito', id })
    }

    useEffect(() => {
        async function veLogado() {
            const resultado = await verificaLogado()
            if (resultado.logado === true) {
                setFuncao(resultado.funcao)
            } else {
                navigate("/")
            }
        }
        veLogado()

        setControleRender(true)
    }, [])

    useEffect(() => {
        if (controleRender) {
            getDadosRelatorio()
        }
    }, [controleRender])

    return (
        <>
            <NavBar />
            {/* Título Principal da página  */}
            <h1 className='mainTitle'>Relatório Final</h1>

            {/* Formulário que contém os dados do relatório */}
            <form>
                <h2 className='mainTitle' >Dados do Pedido</h2>

                {/* Sessão de comparação entre os dados do Relatório de Compras e da Nota Fiscal */}
                <div className='dados-compras-titulo'>
                    <h3 className='relatorio-compra'>Relatório de Compras</h3> <h3 className='dados-titulo'>Dados da Nota Fiscal</h3>
                </div>

                <div className='alinhamento-comparacao'>
                    {dadosRelatorio.Resultados.map((resultado, index) => {
                        if (resultado.comparacao === 'Relatório Compras x Nota fiscal | Produto') {
                            return (
                                /* Cada if possui uma div dessas que é um campo de comparação, o assunto está descrito na tag label. Nesse caso é a comparação dos produtos */
                                <div className={`${resultado.resultado === true ? 'boxFinalReportGreen' : 'boxFinalReportRed'}`}>
                                    <label className='informacao-comparacao'>Produto:</label>
                                    <input className='input-relatorio-final' type="text" value={dadosRelatorio.pedido.Produto} readOnly /> <input className='input-relatorio-final' type="text" value={dadosRelatorio.notaFiscal.Produto} readOnly />
                                    <div className='informacao-comparacao'></div>
                                </div>
                            )
                        }
                        else if (resultado.comparacao === 'Relatório Compras x Nota fiscal | CNPJ') {
                            return (
                                <div className={`${resultado.resultado === true ? 'boxFinalReportGreen' : 'boxFinalReportRed'}`}>
                                    <label className='informacao-comparacao'>CNPJ:</label>
                                    <input className='input-relatorio-final' type="text" value={dadosRelatorio.pedido.CNPJ} readOnly /> <input className='input-relatorio-final' type="text" value={dadosRelatorio.notaFiscal.CNPJ} readOnly />
                                    <div className='informacao-comparacao'></div>
                                </div>
                            )
                        }
                        else if (resultado.comparacao === 'Relatório Compras x Nota fiscal | Transportadora') {
                            return (
                                <div className={`${resultado.resultado === true ? 'boxFinalReportGreen' : 'boxFinalReportRed'}`} >
                                    <label className='informacao-comparacao'>Transportadora:</label>
                                    <input className='input-relatorio-final' type="text" value={dadosRelatorio.pedido.Transportadora} readOnly /> <input className='input-relatorio-final' type="text" value={dadosRelatorio.notaFiscal.Transportadora} readOnly />
                                    <div className='informacao-comparacao'></div>
                                </div>
                            )
                        }
                        else if (resultado.comparacao === 'Relatório Compras x Nota fiscal | Valor Unidade') {
                            return (
                                <div className={`${resultado.resultado === true ? 'boxFinalReportGreen' : 'boxFinalReportRed'}`}>
                                    <label className='informacao-comparacao'>Valor Unitário:</label>
                                    <input className='input-relatorio-final' type="text" value={dadosRelatorio.pedido.ValorUnitario} readOnly /> <input className='input-relatorio-final' type="text" value={dadosRelatorio.notaFiscal.ValorUnitario} readOnly />
                                    <div className='informacao-comparacao'></div>
                                </div>
                            )
                        } else if (resultado.comparacao === 'Relatório Compras x Nota fiscal | Valor Total') {
                            return (
                                <div className={`${resultado.resultado === true ? 'boxFinalReportGreen' : 'boxFinalReportRed'}`}>
                                    <label className='informacao-comparacao'>Valor Total:</label>
                                    <input className='input-relatorio-final' type="text" value={dadosRelatorio.pedido.ValorTotal} readOnly /> <input className='input-relatorio-final' type="text" value={dadosRelatorio.notaFiscal.ValorTotal} readOnly />
                                    <div className='informacao-comparacao'></div>
                                </div>
                            )
                        } else if (resultado.comparacao === 'Relatório Compras x Nota fiscal | Condição de Pagamento') {
                            return (
                                <div className={`${resultado.resultado === true ? 'boxFinalReportGreen' : 'boxFinalReportRed'}`}>
                                    <label className='informacao-comparacao'>Condição de Pagamento:</label>
                                    <input className='input-relatorio-final' type="text" value={dadosRelatorio.pedido.CondicaoPagamento} readOnly /> <input className='input-relatorio-final' type="text" value={dadosRelatorio.notaFiscal.CondicaoPagamento} readOnly />
                                    <div className='informacao-comparacao'></div>
                                </div>
                            )
                        } else if (resultado.comparacao === 'Relatório Compras x Nota fiscal | Tipo Frete') {
                            return (
                                <div className={`${resultado.resultado === true ? 'boxFinalReportGreen' : 'boxFinalReportRed'}`}>
                                    <label className='informacao-comparacao'>Tipo de Frete:</label>
                                    <input className='input-relatorio-final' type="text" value={dadosRelatorio.pedido.TipoFrete} readOnly /> <input className='input-relatorio-final' type="text" value={dadosRelatorio.notaFiscal.TipoFrete} readOnly />
                                    <div className='informacao-comparacao'></div>
                                </div>
                            )
                        } else if (resultado.comparacao === 'Relatório Compras x Nota fiscal | Data do Pedido') {
                            return (
                                <div className={`${resultado.resultado === true ? 'boxFinalReportGreen' : 'boxFinalReportRed'}`}>
                                    <label className='informacao-comparacao'>Data do Pedido:</label>
                                    <input className='input-relatorio-final' type="text" value={dadosRelatorio.pedido.DataPedido} readOnly /> <input className='input-relatorio-final' type="text" value={dadosRelatorio.notaFiscal.DataPedido} readOnly />
                                    <div className='informacao-comparacao'></div>
                                </div>
                            )
                        } else if (resultado.comparacao === 'Relatório Compras x Nota fiscal | Data de Entrega') {
                            return (
                                <div className={`${resultado.resultado === true ? 'boxFinalReportGreen' : 'boxFinalReportRed'}`}>
                                    <label className='informacao-comparacao'>Data de entrega:</label>
                                    <input className='input-relatorio-final' type="text" value={dadosRelatorio.pedido.DataEntrega} readOnly /> <input className='input-relatorio-final' type="text" value={dadosRelatorio.notaFiscal.DataEntrega} readOnly />
                                    <div className='informacao-comparacao'></div>
                                </div>
                            )
                        } else if (resultado.comparacao === 'Relatório Compras x Nota fiscal | Quantidade') {
                            return (
                                <div className={`${resultado.resultado === true ? 'boxFinalReportGreen' : 'boxFinalReportRed'}`}>
                                    <label className='informacao-comparacao'>Quantidade:</label>
                                    <input className='input-relatorio-final' type="text" value={dadosRelatorio.pedido.Quantidade} readOnly /> <input className='input-relatorio-final' type="text" value={dadosRelatorio.notaFiscal.Quantidade} readOnly />
                                    <div className='informacao-comparacao'></div>
                                </div>
                            )
                        }
                    })}
                </div>

                {/* Sessão de comparação da Análise Quantitativa */}
                <h2 className='mainTitle'>Conferência Quantitativa</h2>
                <div className='dados-compras-titulo'>
                    <h3 className='relatorio-compra'>Dados da Nota Fiscal</h3> <h3 className='dados-titulo'>Dados da análise</h3>
                </div>

                <div className='alinhamento-comparacao'>
                    {dadosRelatorio.RegrasAnalises.map((regra, index) => {
                        const analiseQuantitativa = dadosRelatorio.Resultados.find((resultado) => resultado.comparacao === 'Nota Fiscal x Dados da Análise Quantitativa | Peso')
                        if (regra.tipo === 'Análise Quantitativa') {
                            return (
                                <div key={index} className={`${analiseQuantitativa?.resultado === true ? 'boxFinalReportGreen' : 'boxFinalReportRed'}`}>
                                    <label className='informacao-comparacao'>Peso:</label>
                                    <input className='input-relatorio-final' type="text" value={regra.regra} readOnly /> <input className='input-relatorio-final' type="text" value={regra.valor} readOnly />
                                    <div className='informacao-comparacao'></div>
                                </div>
                            )
                        }
                    })}
                </div>

                {/* Sessão de comparação da Análise Qualitativa */}
                <h2 className='mainTitle'>Conferência Qualitativa</h2>
                <div className='dados-compras-titulo'>
                    <h3 className='relatorio-compra'>Regra de Recebimento</h3> <h3 className='dados-titulo'>Dados da análise</h3>
                </div>

                <div className='alinhamento-comparacao'>
                    {dadosRelatorio.Resultados.map((resultado, index) => {
                        if (resultado.comparacao === 'Laudo') {
                            return (
                                <div className={`${resultado.resultado === true ? 'boxFinalReportGreen' : 'boxFinalReportRed'}`}>
                                    <label className='informacao-comparacao'>Presença do laudo:</label>
                                    <input className='input-relatorio-final' type="text" value={'Sim'} readOnly /> <input className='input-relatorio-final' type="text" value={dadosRelatorio.notaFiscal.Laudo} readOnly />
                                    <div className='informacao-comparacao'></div>
                                </div>
                            )
                        }
                    })}
                    {dadosRelatorio.RegrasAnalises.map((regra, index) => {
                        if (regra.tipo === 'Personalizada') {
                            const resultadoPersonalizada = dadosRelatorio.Resultados.find((resultado) => resultado.comparacao === `Regra qualitativa | Personalizada | ${regra.regra}`)
                            return (
                                <div className={`${resultadoPersonalizada?.resultado === true ? 'boxFinalReportGreen' : 'boxFinalReportRed'}`}>
                                    <label className='informacao-comparacao'>{regra.regra}:</label>
                                    <input className='input-relatorio-final' type="text" value={'Sim'} readOnly /> <input className='input-relatorio-final' type="text" value={regra.valor === 'true' ? 'Sim' : 'Não'} readOnly />
                                    <div className='informacao-comparacao'></div>
                                </div>
                            )
                        } else if (regra.tipo === 'Avaria') {
                            const resultadoAvaria = dadosRelatorio.Resultados.find((resultado) => resultado.comparacao === 'Regra qualitativa | Avaria | Não deve haver')
                            return (
                                <div className={`${resultadoAvaria?.resultado === true ? 'boxFinalReportGreen' : 'boxFinalReportRed'}`}>
                                    <label className='informacao-comparacao'>Avaria:</label>
                                    <input className='input-relatorio-final' type="text" value={'Não deve haver'} readOnly /> <input className='input-relatorio-final' type="text" value={regra.valor === 'true' ? 'Não há' : 'Há'} readOnly /><br /><br />
                                    {(regra.avaria !== '' && regra.avaria !== 'undefined')  &&
                                        <input className='input-relatorio-final' type="text" value={regra.avaria} readOnly />
                                    }
                                    <div className='informacao-comparacao'></div>

                                </div>
                            )
                        } else if (regra.tipo !== 'Personalizada' && regra.tipo !== 'Avaria' && regra.tipo !== 'Análise Quantitativa') {
                            const resultadoAnalise = dadosRelatorio.Resultados.find((resultado) => resultado.comparacao === `Regra qualitativa | ${regra.tipo} | ${regra.regra}`)
                            return (
                                <div className={`${resultadoAnalise?.resultado === true ? 'boxFinalReportGreen' : 'boxFinalReportRed'}`}>
                                    <label className='informacao-comparacao'>{regra.tipo}:</label>
                                    <input className='input-relatorio-final' type="text" value={regra.regra} readOnly /> <input className='input-relatorio-final' type="text" value={regra.valor} readOnly />
                                    <div className='informacao-comparacao'></div>
                                </div>
                            )
                        }
                    })}
                </div>

                {/* Exibe a decisão do sistema quanto ao pedido e os botões necessários pra cada uma delas*/}
                {resultadoFinal === 'Aceito' &&
                    <>
                        <div className='titulo-aprovado'>
                            <p>APROVADO</p>
                        </div>
                        <div className='botao-aprovado'>
                            <button className='pedido' onClick={(e) => navigateTo('listaPedidos')}>Outros pedidos</button>
                        </div>
                    </>
                }
                {resultadoFinal === 'Recusado' &&
                    <>
                        <div className='titulo-recusado'>
                            <p>RECUSADO</p>
                        </div>
                        <div className='botao-recusado'>
                            <button className='pedido' onClick={(e) => navigateTo('listaPedidos')}>Outros pedidos</button>

                            {/* Somente o Administrador e os Gerentes podem forçar o aceite em caso de recusa */}
                            {(funcao === 'Administrador' || funcao === 'Gerente') &&
                                <>
                                    <button className='force-aceite' onClick={(e) => forcarAceite()}>Forçar aceite</button>
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