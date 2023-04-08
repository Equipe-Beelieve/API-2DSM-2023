import React from 'react';
import { useState, useEffect } from 'react';
import cadastro from '../images/cadastro.png'
import api from '../services/api';
import { Link } from 'react-router-dom';


export interface Fornecedor {
    for_codigo: number;
    for_cnpj: string;
    for_razao_social: string;
    for_nome_fantasia: string;
    end_cep: string;
}

function ListaFornecedor(){
    const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])
    
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
        getFornecedores();
        
    }, []) //Aciona as funções apenas quando a página é renderizada
    

    return(
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
    )
}

export default ListaFornecedor