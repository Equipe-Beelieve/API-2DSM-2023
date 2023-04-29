import React,{ useState, useEffect } from 'react';
import cadastro from '../images/cadastro.png'
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import verificaLogado from '../funcoes/verificaLogado';
import NavBar from './NavBar';
import unidecode from 'unidecode'

interface Pedido {
    ped_codigo:number
    ped_razao_social:string
    ped_produto_massa:string
    ped_descricao:string
    ped_valor_total:string
    ped_data_entrega:string
    ped_status:string
}

function ListaPedidos(){
    const [pedidos, setPedido] = useState<Pedido[]>([])
    const [funcao, setFuncao] = useState('')
    const [renderizou, setRenderizou] = useState(false)
    const navegate = useNavigate()

    const [busca, setBusca] = useState('') //state para armazenar o termo da busca do usuário
    const [pedidosBuscados, setPedidosBuscados] = useState<Pedido[]>([]) //state para armazenar os resultados correspondentes da busca

    async function getPedidos() {
        try{
            const response = await api.get('/listaPedido')
            setPedido(response.data.tabelaPedidos) //pegando os dados da resposta
            console.log(response.data.tabelaPedidos)
        }
        catch(erro){
            console.log(erro)
        }
    }

    function selecionaPedido(id:number) {
        navegate(`/recebePedido/${id}`)
    }
    // async function veLogado(){
    //     let resultado = await verificaLogado()
    //     console.log(`RARARAGAGAULAAA ${resultado}`)
    //     setLogado(resultado)
    // }

    function buscarPedidos(pedidos:Pedido[], busca:string) { // função que filtra os pedidos de acordo com o termo da busca
        let buscaMinusc = busca.toLowerCase() //normalizando o texto para a busca não ser Case sensitive e nem precisar dos acentos corretos
        let buscaNormalizada = unidecode(buscaMinusc)
        return pedidos.filter((pedido) => {
            const razaoSocial = unidecode(pedido.ped_razao_social.toLowerCase()).includes(buscaNormalizada) //cada variável testa a ocorrência em um campo específico
            const numeroPedido = pedido.ped_codigo.toLocaleString().includes(buscaNormalizada)
            const nomeProduto = unidecode(pedido.ped_descricao.toLowerCase()).includes(buscaNormalizada)
            return razaoSocial || numeroPedido || nomeProduto //retorna os pedidos cujo a busca se encaixe em pelo menos um campo definido
        })
    }

    function atualizarBusca(busca:string) { //função que vai atualizar a busca sempre que um valor for digitado (ou apagado) do campo de busca
        const buscaPedidos = buscarPedidos(pedidos, busca)
        setPedidosBuscados(buscaPedidos)
    }


    useEffect(()=>{ 
        async function veLogado(){
            let resultado = await verificaLogado()
            //setLogado(resultado)
            if (resultado.logado){
                getPedidos();
                setFuncao(resultado.funcao)
                setRenderizou(true)
                atualizarBusca(busca)
            }
            else{
                navegate('/')
            }
        }
        veLogado()
        //console.log('foi')
    }, [busca, pedidos]) //Aciona as funções apenas quando a página é renderizada
    
    useEffect(()=>{ // Garante uma segunda renderização para que nenhum pedido fique fora
        if (!renderizou){
            getPedidos()
            setRenderizou(true)
            //console.log('FOI 1')
        }else{
            //console.log('FOI 2')
            return;
        }
    },[renderizou])

    return(
        <>
        <NavBar />
        <center>
            <h1 className="mainTitle">PEDIDOS</h1>
        </center>
        <div className="mainContent">
            <div className="state">
                <button>A caminho</button>
                <button>Em análise</button>
                <button>Finalizado</button>
                {(funcao === 'Administrador' || funcao === 'Gerente') &&
                <button id="register">
                    <Link to={'/cadastroPedido'} id='linkBotaoCadastro'>
                        <img className="cadastro" src={cadastro} alt=""/>
                    </Link>
                </button>
                }
            </div>
            <div>
                <input type="text"
                placeholder='pedido, fornecedor, produto...'
                value = {busca}
                onChange = {(evento) => setBusca(evento.target.value)}
                onKeyUp= {(evento) => atualizarBusca(busca)} />
            </div>
            {pedidosBuscados.map((pedido, index) =>(
                <div className='listaOut' key={index} onClick={() =>{selecionaPedido(pedido.ped_codigo)}}>
                    <div className="listaIn">
                        <h1>Pedido nº{pedido.ped_codigo} - {pedido.ped_descricao} ({pedido.ped_razao_social})</h1>
                        <div className="listColumns">
                            <div className="column1">
                                <p>Peso: {pedido.ped_produto_massa}</p>
                                <p>Valor total: {pedido.ped_valor_total}</p>
                                <p>Data de entrega: {pedido.ped_data_entrega}</p>
                                <p>Estado do pedido: {pedido.ped_status}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))
            }
        </div>

        </>
    )
}



export default ListaPedidos