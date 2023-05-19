import {useState, useEffect} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../services/api'
import NavBar from './NavBar'
import verificaLogado from '../funcoes/verificaLogado'

interface Regras {
    tipo: string,
    valor: string,
    regra: string
}
interface Relatorio {
        RegrasAnalises: Regras[]
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
    const [dadosRelatorio, setDadosRelatorio] = useState<Relatorio>({RegrasAnalises: [], notaFiscal:{...Object.assign({})}, pedido:{...Object.assign({})}})
    const navigate = useNavigate()
    const {id} = useParams()

    async function getDadosRelatorio(){
        try {
            await api.post("/relatorioFinal", {id}).then((resposta) => {
                let dados = resposta.data
                setDadosRelatorio(dados)
                console.log(dados)
            })   
        } 
        catch (erro) {
            console.log(erro)
        }
    }

    useEffect(() => {
        async function veLogado() {
            const resultado = await verificaLogado()
            if(!resultado.logado){
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
                    <div>
                        <label>Produto</label>
                        <input type="text" value={dadosRelatorio.pedido.Produto} readOnly/> <input type="text" value={dadosRelatorio.notaFiscal.Produto}/>
                    </div>
                    <div>
                        <label >Razão Social</label>
                        <input type="text" value={dadosRelatorio.pedido.RazaoSocial} readOnly/> <input type="text" value={dadosRelatorio.notaFiscal.RazaoSocial}/>
                    </div>
                    <div>
                        <label>Transportadora</label>
                        <input type="text" value={dadosRelatorio.pedido.Transportadora} readOnly/> <input type="text" value={dadosRelatorio.notaFiscal.Transportadora}/>
                    </div>
                    <div>
                        <label>Valor Unitário</label>
                        <input type="text" value={dadosRelatorio.pedido.ValorUnitario} readOnly/> <input type="text" value={dadosRelatorio.notaFiscal.ValorUnitario}/>
                    </div>
                    <div>
                        <label>Valor Total</label>
                        <input type="text" value={dadosRelatorio.pedido.ValorTotal} readOnly/> <input type="text" value={dadosRelatorio.notaFiscal.ValorTotal}/>
                    </div>
                    <div>
                        <label>Condição de Pagamento</label>
                        <input type="text" value={dadosRelatorio.pedido.CondicaoPagamento} readOnly/> <input type="text" value={dadosRelatorio.notaFiscal.CondicaoPagamento}/>
                    </div>
                    <div>
                        <label>Tipo de Frete</label>
                        <input type="text" value={dadosRelatorio.pedido.TipoFrete} readOnly/> <input type="text" value={dadosRelatorio.notaFiscal.TipoFrete}/>
                    </div>
                    <div>
                        <label>Data de entrega</label>
                        <input type="text" value={dadosRelatorio.pedido.DataEntrega} readOnly/> <input type="text" value={dadosRelatorio.notaFiscal.DataEntrega}/>
                    </div>
                    <div>
                        <label>Quantidade</label>
                        <input type="text" value={dadosRelatorio.pedido.Quantidade} readOnly/> <input type="text" value={dadosRelatorio.notaFiscal.Quantidade}/>
                    </div>

                <h2>Conferência Quantitativa</h2>
                <h3>Dados da Nota Fiscal</h3> <h3>Dados da análise</h3>
                    {dadosRelatorio.RegrasAnalises.map((regra, index) => {
                            if(regra.tipo === 'Análise Quantitativa'){
                                return (
                                    <div>
                                        <label>Peso</label>
                                        <input type="text" value={regra.regra} readOnly/> <input type="text" value={regra.valor}/>
                                    </div>
                                )
                            }
                        })}
                
                <h2>Conferência Qualitativa</h2>
                <h3>Regra de Recebimento</h3> <h3>Dados da análise</h3>
                    <div>
                        <label>Presença do laudo</label>
                        <input type="text" value={'Sim'} readOnly/> <input type="text" value={dadosRelatorio.notaFiscal.Laudo}/>
                    </div>
                    {dadosRelatorio.RegrasAnalises.map((regra, index) => {
                        if(regra.tipo === 'Personalizada'){
                            return(
                                <div>
                                    <label>Personalizada</label>
                                    <input type="text" value={'Sim'} readOnly/> <input type="text" value={regra.valor === 'true'? 'Sim' : 'Não'}/>
                                </div>
                            )
                        } else if(regra.tipo === 'Avaria'){
                            return(
                                <div>
                                    <label>Avaria</label>
                                    <input type="text" value={'Não deve haver'} readOnly/> <input type="text" value={regra.valor === 'true'? 'Não há' : 'Há'}/>
                                </div>
                            )
                        } else {
                            return(
                                <div>
                                    <label>{regra.tipo}</label>
                                    <input type="text" value={regra.regra} readOnly/> <input type="text" value={regra.valor}/>
                                </div>
                            )
                        }
                    })}



                
            </form>
        </>
    )
}

export default RelatorioFinal