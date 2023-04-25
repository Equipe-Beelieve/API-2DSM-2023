import React from 'react';
import { useState, useEffect } from 'react';
import cadastro from '../images/cadastro.png'
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import verificaLogado from '../funcoes/verificaLogado';
import NavBar from './NavBar';


interface Pedido {
    ped_codigo:number
    ped_razao_social:string
    ped_produto_massa:string
    ped_descricao:string
    ped_valor_total:string
    ped_data_entrega:string
}

function ListaPedidos(){
    const [pedidos, setPedido] = useState<Pedido[]>([])
    const [funcao, setFuncao] = useState('')
    const [renderizou, setRenderizou] = useState(false)
    const navegate = useNavigate()
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

    useEffect(()=>{
        
        async function veLogado(){
            let resultado = await verificaLogado()
            //setLogado(resultado)
            if (resultado.logado){
                getPedidos();
                setFuncao(resultado.funcao)
                setRenderizou(true)
            }
            else{
                navegate('/')
            }
        }
        veLogado()
        console.log('foi')
    }, []) //Aciona as funções apenas quando a página é renderizada
    
    useEffect(()=>{ // Garante uma segunda renderização para que nenhum pedido fique fora
        if (!renderizou){
            getPedidos()
            setRenderizou(true)
            console.log('FOI 1')
        }else{
            console.log('FOI 2')
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
            {pedidos.map((pedido, index) =>(
                <div className='listaOut' key={index} onClick={() =>{selecionaPedido(pedido.ped_codigo)}}>
                    <div className="listaIn">
                        <h1>Pedido nº{pedido.ped_codigo} - {pedido.ped_descricao} ({pedido.ped_razao_social})</h1>
                        <div className="listColumns">
                            <div className="column1">
                                <p>Peso: {pedido.ped_produto_massa}</p>
                                <p>Valor total: {pedido.ped_valor_total}</p>
                                <p>Data de entrega: {pedido.ped_data_entrega}</p>
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