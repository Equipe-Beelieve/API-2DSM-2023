import React from 'react';
import { useState, useEffect } from 'react';
import cadastro from '../images/cadastro.png'
import api from '../services/api';
import { Link } from 'react-router-dom';

function ListaFornecedor(){
    const [fornecedor, setFornecedor] = useState([])
    
    const getFornecedor = () => {
        
        api.get('/listaFornecedores')
        .then((res) =>{
            const dados = JSON.parse(res.data.jsonFornecedores)

            //pegando os dados da resposta
            console.log(fornecedor) 
            console.log(dados)
            setFornecedor(dados)
            console.log(fornecedor)
        })
        .catch((res)=>{
            console.log('erro')
        })
    }


    useEffect(()=>{
        getFornecedor();
        
    }, []) //Aciona as funções apenas quando a página é renderizada
    

    return(
        <><center>
            <h1 className="mainTitle">FORNECEDORES</h1>
        </center>
        <div className="mainContent">
            <div className="state">
                <button>A caminho</button>
                <button>Em análise</button>
                <button>Finalizado</button>
                <button id="register">
                    <Link to={"/cadastroFornecedor"} >
                        <img className="cadastro" src={cadastro}/>
                    </Link>
                </button>
            </div>
            
                {/* <div className='listaOut' key={id}>
                    <h1>Pedido nº{fornecedor[0].for_codigo}</h1>
                </div> */}
            
        </div>

        </>
    )
}

export default ListaFornecedor