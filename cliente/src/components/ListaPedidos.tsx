import React from 'react';
import { useState, useEffect } from 'react';
import cadastro from '../images/cadastro.png'
import api from '../services/api';

function ListaPedidos(){

    
    const [pedidos, setPedido] = useState([])
    
    const getPedidos = async () => {
        try{
            const resposta = await api.get('/listaPedido')
            setPedido(resposta.data) //pegando os dados da resposta
            console.log(resposta.data)
        }
        catch(error){
            console.log(error)
        }
        
    }


    useEffect(()=>{
        getPedidos();
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
                    <a href="/cadastroPedido">
                        <img className="cadastro" src={cadastro}/>
                    </a>
                </button>
            </div>
            {/* {pedidos.map((pedido, id)=>(
                <div className='listaOut' key={id}>
                    <h1>Pedido nº{pedido}</h1>
                </div>
            ))} */}
        </div>

        </>
    )
}



export default ListaPedidos