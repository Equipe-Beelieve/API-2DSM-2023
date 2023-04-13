import React from 'react';
import { useState, useEffect } from 'react';
import cadastro from '../images/cadastro.png'
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import verificaLogado from '../funcoes/verificaLogado';
import NavBar from './NavBar';


export interface Fornecedor {
    for_codigo: number;
    for_cnpj: string;
    for_razao_social: string;
    for_nome_fantasia: string;
    end_cep: string;
}

function ListaFornecedor(){
    const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])
    const [logado, setLogado] = useState(Boolean)
    const navegate = useNavigate()

    async function getFornecedores() {
        try {
            const response = await api.get('/listaFornecedores')
            console.log(response.data.tabelaFornecedores)
            setFornecedores(response.data.tabelaFornecedores)
        } catch (erro) {
            console.log(erro)
        }
    }


    useEffect(()=>{
        async function veLogado(){
            let resultado = await verificaLogado()
            //setLogado(resultado)
            if (resultado.logado){
                getFornecedores();
                if (resultado.funcao !== 'Administrador' && resultado.funcao !== 'Gerente'){
                    navegate('/listaPedidos')
                }

            }
            else{
                navegate('/')
            }
        }
        veLogado()
        
        
    }, []) //Aciona as funções apenas quando a página é renderizada
    

    return(
        <>
        <NavBar />
        <div className='mainContent'>
            <div className="titleRegister">
                <h1 className="mainTitle">FORNECEDORES</h1>
                    <button id="register">
                        <Link to={'/cadastroFornecedor'}>
                            <img className="cadastro" src={cadastro} alt=""/>
                        </Link>
                    </button>
            </div>
            
            {fornecedores.map((fornecedor, index) => (
                <div className='listaOut' key={index}>
                    <div className="listaIn">
                        <h1>Fornecedor nº{fornecedor.for_codigo}</h1>
                        <div className="listColumns">
                            <div className="column1">
                                <p>Razão social: {fornecedor.for_razao_social}</p>
                                <p>Nome fantasia: {fornecedor.for_nome_fantasia}</p>
                            </div>
                            <div className="column2">
                                <p>CNPJ: {fornecedor.for_cnpj}</p>
                                <p>CEP: {fornecedor.end_cep}</p>
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

export default ListaFornecedor