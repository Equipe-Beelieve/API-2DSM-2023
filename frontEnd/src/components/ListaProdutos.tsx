import React from 'react';
import { useState, useEffect } from 'react';
import cadastro from '../images/cadastro.png'
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import verificaLogado from '../funcoes/verificaLogado';
import NavBar from './NavBar';

export interface Produto {
    prod_codigo: number
    prod_descricao:string
    prod_unidade_medida:string
}

function ListaProdutos(){
    const [produtos, setProdutos] = useState<Produto[]>([])
    const [logado, setLogado] = useState(Boolean)
    const [renderizou, setRenderizou] = useState(false)
    const navegate = useNavigate()

    async function getProdutos(){
        try {
            const response = await api.get('/listaProdutos')
            console.log(response.data.tabelaProdutos)
            setProdutos(response.data.tabelaProdutos)
        } catch (erro) {
            console.log(erro)
        }
    }

    useEffect(()=>{
        async function veLogado(){
            let resultado = await verificaLogado()
            if (resultado.logado){
                getProdutos()
                if (resultado.funcao !== 'Administrador' && resultado.funcao !== 'Gerente'){
                    navegate('/listaPedidos')
                }
            } else {
                navegate('/')
            }
        } veLogado()
    },[])

    useEffect(()=>{ // Garante uma segunda renderização para que nenhum pedido fique fora
        if (!renderizou){
            getProdutos()
            console.log('FOI 1')
            setRenderizou(true)
        }else{
            console.log('FOI 2')
            return;
        }
    },[renderizou])

    return(
        <>
        <NavBar />
        <div className = "mainContent">
            <div className = "titleRegister">
                <h1 className = "mainTitle">PRODUTOS</h1>
                    <button id = "register">
                        <Link to = {'/cadastroProduto'}>
                            <img className = "cadastro" src={cadastro} alt="" />
                        </Link>
                    </button>
            </div>
            {produtos.map((produto, index)=>(
                <div className = "listaOut" key = {index}>
                    <div className = "listaIn">
                        <h1>
                            Produto nº{produto.prod_codigo}
                        </h1>
                        <div className = "listColumns">
                            <div className = "column1">
                                <p>Descrição: {produto.prod_descricao}</p>
                                <p>Unidade de medida: {produto.prod_unidade_medida}</p>
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

export default ListaProdutos