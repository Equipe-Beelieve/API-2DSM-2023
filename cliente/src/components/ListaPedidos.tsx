import React from 'react';
import { useState, useEffect } from 'react';
import cadastro from '../images/cadastro.png'
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import verificaLogado from '../funcoes/verificaLogado';


interface Pedido {
    ped_codigo:number
    ped_razao_social:string
    ped_produto_massa:string
    ped_descricao:string
    ped_valor_total:string
    ped_data_entrega:string
}

function ListaPedidos(){
    const [logado, setLogado] = useState(Boolean)
    const [pedidos, setPedido] = useState<Pedido[]>([])
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
    // async function veLogado(){
    //     let resultado = await verificaLogado()
    //     console.log(`RARARAGAGAULAAA ${resultado}`)
    //     setLogado(resultado)
    // }

    useEffect(()=>{
        async function veLogado(){
            let resultado = await verificaLogado()
            console.log(`RARARAGAGAULAAA ${resultado}`)
            await setLogado(resultado)
            await console.log(`AQUIII ${logado}`)
            if (resultado){
                getPedidos();
            }
            else{
                navegate('/')
            }
        }
        veLogado()
        
    }, []) //Aciona as funções apenas quando a página é renderizada
    
    return(
        <><center>
            <h1 className="mainTitle">PEDIDOS</h1>
        </center>
        <div className="mainContent">
            <div className="state">
                <button>A caminho</button>
                <button>Em análise</button>
                <button>Finalizado</button>
                <button id="register">
                    <Link to={'/cadastroPedido'}>
                        <img className="cadastro" src={cadastro} alt=""/>
                    </Link>
                </button>
            </div>
            {pedidos.map((pedido, index) =>(
                <div className='listaOut' key={index}>
                <div className="listaIn">
                    <h1>Pedido nº{pedido.ped_codigo} Produto: ({pedido.ped_razao_social})</h1>
                    <div className="listColumns">
                        <div className="column1">
                            <p>Peso: {pedido.ped_produto_massa}</p>
                            <p>Data de entrega: {pedido.ped_data_entrega}</p>
                        </div>
                        <div className="column2">
                            <p>Valor total: {pedido.ped_valor_total}</p>
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