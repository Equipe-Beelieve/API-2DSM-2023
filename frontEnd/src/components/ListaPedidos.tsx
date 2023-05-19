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
    const [id, setId] = useState(null);
    const [pedidos, setPedido] = useState<Pedido[]>([])
    const [funcao, setFuncao] = useState('')
    const [renderizou, setRenderizou] = useState(false)
    const navegate = useNavigate()

    const [busca, setBusca] = useState('') //state para armazenar o termo da busca do usuário
    const [pedidosBuscados, setPedidosBuscados] = useState<Pedido[]>([]) //state para armazenar os resultados correspondentes da busca

    const [filtroStatus, setFiltroStatus] = useState('')

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

    async function getIdPedido() {
        try {
          const response = await api.get('/listaPedido');
          const id = response.data.tabelaPedidos[0].ped_codigo;
          console.log(id);
          return id;
        } catch (error) {
          console.error(error);
        }
      }
      
      async function deletePedido(id: number) {
        try {
          const post = (id); 
          await api.post('/deletePedido', { post });
          console.log(post);
        } catch (error) {
          console.error(error);
        }
      }
      

      async function deletaPedido() {
        try {
          const id = await getIdPedido();
          await deletePedido(id);
        } catch (error) {
          console.error(error);
        }
      }

    function selecionaPedido(id:number, status:string) {
        if (status === 'A caminho'){
            navegate(`/recebePedido/${id}`)
        }
        else if (status === 'Análise Quantitativa'){
            navegate(`/analiseQuant/${id}`)
        }
        else if (status === 'Análise Qualitativa'){
            navegate(`/analiseQuali/${id}`)
        }
        else if (status === 'Recusado'){
            navegate('/listaPedidos')
        }
        else{
            navegate('/listaPedidos')
        }
    }
    // async function veLogado(){
    //     let resultado = await verificaLogado()
    //     console.log(`RARARAGAGAULAAA ${resultado}`)
    //     setLogado(resultado)
    // }

    function filtrarStatus(pedidos:Pedido[]) { //essa função faz uma pré-filtragem dos pedidos pelo status dele e envia esse array pra funnção de busca trabalhar em cima
        if(!filtroStatus){
            return pedidos

        } else {
            if(filtroStatus === 'A caminho') {
                return pedidos.filter((pedido) => {
                    return pedido.ped_status.includes('A caminho')
                })
            } else if(filtroStatus === 'Em análise') {
                return pedidos.filter((pedido) => {
                    const analise_quant = pedido.ped_status.includes('Análise Quantitativa')
                    const analise_quali = pedido.ped_status.includes('Análise Qualitativa')
                    return analise_quant || analise_quali
                })
            } else if (filtroStatus === 'Finalizado'){
                return pedidos.filter((pedido) => {
                    // const aprovado = pedido.ped_status.includes('Aprovado')
                    // const recusado = pedido.ped_status.includes('Recusado')
                    // return aprovado || recusado
                    const finalizado = pedido.ped_status.includes('Finalizado')
                    return finalizado
                })
            }
        }
        return pedidos
    }

    function buscarPedidos(pedidos:Pedido[], busca:string) { // função que filtra os pedidos de acordo com o termo da busca
        let buscaMinusc = busca.toLowerCase() //normalizando o texto para a busca não ser Case sensitive e nem precisar dos acentos corretos
        let buscaNormalizada = unidecode(buscaMinusc)
        let pedidosFiltrados = filtrarStatus(pedidos)
        return pedidosFiltrados.filter((pedido) => {
            const razaoSocial = unidecode(pedido.ped_razao_social.toLowerCase()).includes(buscaNormalizada) //cada variável testa a ocorrência em um campo específico
            const numeroPedido = pedido.ped_codigo.toLocaleString().includes(buscaNormalizada)
            const nomeProduto = unidecode(pedido.ped_descricao.toLowerCase()).includes(buscaNormalizada)
            const statusPedido = unidecode(pedido.ped_status.toLowerCase()).includes(buscaNormalizada)
            return razaoSocial || numeroPedido || nomeProduto || statusPedido //retorna os pedidos cujo a busca se encaixe em pelo menos um campo definido
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
                {/* aqui o código confere se o botão de filtro clicado já estava ativo e passa uma string vazia (desativa o filtro), se for o caso */}
                <button className='lista_button' onClick = {(evento) => setFiltroStatus(filtroStatus === 'A caminho' ? '' : 'A caminho') }>A caminho</button> 
                <button className='lista_button' onClick = {(evento) => setFiltroStatus(filtroStatus === 'Em análise' ? '' : 'Em análise')}>Em análise</button>
                <button className='lista_button' onClick = {(evento) => setFiltroStatus(filtroStatus === 'Finalizado' ? '' : 'Finalizado')}>Finalizado</button>
                {(funcao === 'Administrador' || funcao === 'Gerente') &&
                <button id="register">
                    <Link to={'/cadastroPedido'} id='linkBotaoCadastro'>
                        <img className="cadastro" src={cadastro} alt=""/>
                    </Link>
                </button>
                }
            </div>
            <div>
                <input type="text" className="termo-pesquisa" id="imagem-pesquisa"
                placeholder='pedido, fornecedor, produto...'
                value = {busca}
                onChange = {(evento) => setBusca(evento.target.value)}
                onKeyUp= {(evento) => atualizarBusca(busca)} />
            </div>
            {pedidosBuscados.map((pedido, index) =>(
                    <div className="listaIn" key={index}>
                        <h1>Pedido nº{pedido.ped_codigo} - {pedido.ped_descricao} ({pedido.ped_razao_social})</h1>
                        <div className="listColumns">
                            <div className="column1">
                                <p>Peso: {pedido.ped_produto_massa}</p>
                                <p>Valor total: {pedido.ped_valor_total}</p>
                                <p>Data de entrega: {pedido.ped_data_entrega}</p>
                                <p>Estado do pedido: {pedido.ped_status}</p>
                                <hr className='hr_pedido' />
                                <p>Revisão:</p>
                                <center>
                                {pedido.ped_status === 'Finalizado' &&
                                    <>
                                    <button type='button' className='ped_btn' onClick={() => { navegate(`/cadastroPedido/${pedido.ped_codigo}`); } }>Cadastro do Pedido</button>
                                    <button type='button' className='ped_btn' onClick={() => { navegate(`/recebePedido/${pedido.ped_codigo}`); } }>Nota Fiscal</button>
                                    <button type='button' className='ped_btn' onClick={() => { navegate(`/analiseQuant/${pedido.ped_codigo}`); } }>Análise Quantitativa</button>
                                    <button type='button' className='ped_btn' onClick={() => { navegate(`/analiseQuali/${pedido.ped_codigo}`); } }>Análise Qualitativa</button>
                                    <hr className='hr_pedido' />
                                    <button type='button' className='ped_btn2' onClick={() => { navegate(`/relatorioFinal/${pedido.ped_codigo}`)} }>Relatório Final</button>
                                
                                    </>
                                }
                                {pedido.ped_status === 'Análise Qualitativa' &&
                                    <>
                                    <button type='button' className='ped_btn' onClick={() => { navegate(`/cadastroPedido/${pedido.ped_codigo}`); } }>Cadastro do Pedido</button>
                                    <button type='button' className='ped_btn' onClick={() => { navegate(`/recebePedido/${pedido.ped_codigo}`); } }>Nota Fiscal</button>
                                    <button type='button' className='ped_btn' onClick={() => { navegate(`/analiseQuant/${pedido.ped_codigo}`); } }>Análise Quantitativa</button>
                                    <hr className='hr_pedido' />
                                    <button type='button' className='ped_btn2' onClick={() => { navegate(`/analiseQuali/${pedido.ped_codigo}`); } }>Análise Qualitativa</button>
                                    </>
                                }
                                {pedido.ped_status === 'Análise Quantitativa' &&
                                    <>
                                    <button type='button' className='ped_btn' onClick={() => { navegate(`/cadastroPedido/${pedido.ped_codigo}`); } }>Cadastro do Pedido</button>
                                    <button type='button' className='ped_btn' onClick={() => { navegate(`/recebePedido/${pedido.ped_codigo}`); } }>Nota Fiscal</button>
                                    <hr className='hr_pedido' />
                                    <button type='button' className='ped_btn2' onClick={() => { navegate(`/analiseQuant/${pedido.ped_codigo}`); } }>Análise Quantitativa</button>
                                    </>
                                }
                                {pedido.ped_status === 'A caminho' &&
                                    <>
                                    <button type='button' className='ped_btn' onClick={() => { navegate(`/cadastroPedido/${pedido.ped_codigo}`); } }>Revisão do Cadastro<p></p> de Pedidos</button>
                                    <hr className='hr_pedido' />
                                    <button type='button' className='ped_btn2' onClick={() => { navegate(`/recebePedido/${pedido.ped_codigo}`); } }>Receber Pedido</button>
                                    </>
                                }
                                </center>

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