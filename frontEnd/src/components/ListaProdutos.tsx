import React from 'react';
import { useState, useEffect } from 'react';
import cadastro from '../images/cadastro.png'
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import verificaLogado from '../funcoes/verificaLogado';
import NavBar from './NavBar';
import unidecode from 'unidecode';

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

    const [busca, setBusca] = useState('') //state para armazenar o termo da busca do usuário
    const [produtosBuscados, setProdutosBuscados] = useState<Produto[]>([]) //state para armazenar os resultados correspondentes da busca

    async function getProdutos(){
        try {
            const response = await api.get('/listaProdutos')
            console.log(response.data.tabelaProdutos)
            setProdutos(response.data.tabelaProdutos)
        } catch (erro) {
            console.log(erro)
        }
    }

    function buscarProdutos(produtos:Produto[], busca:string) { // função que filtra os pedidos de acordo com o termo da busca
        let buscaMinusc = busca.toLowerCase() //normalizando o texto para a busca não ser Case sensitive e nem precisar dos acentos corretos
        let buscaNormalizada = unidecode(buscaMinusc)
        return produtos.filter((produto) => {
            const nomeProduto = unidecode(produto.prod_descricao.toLowerCase()).includes(buscaNormalizada) //cada variável testa a ocorrência em um campo específico
            const codigoProduto = produto.prod_codigo.toLocaleString().includes(buscaNormalizada)
            return nomeProduto || codigoProduto //retorna os pedidos cujo a busca se encaixe em pelo menos um campo definido
        })
    }

    function atualizarBusca(busca:string) {
        const buscaProdutos = buscarProdutos(produtos, busca)
        setProdutosBuscados(buscaProdutos)
    }

    useEffect(()=>{
        async function veLogado(){
            let resultado = await verificaLogado()
            if (resultado.logado){
                getProdutos()
                atualizarBusca(busca)
                if (resultado.funcao !== 'Administrador' && resultado.funcao !== 'Gerente'){
                    navegate('/listaPedidos')
                }
            } else {
                navegate('/')
            }
        } veLogado()
    },[busca, produtos])

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
                        <Link to = {'/cadastroProduto'} id='linkBotaoCadastro'>
                            <img className = "cadastro" src={cadastro} alt="" />
                        </Link>
                    </button>
            </div>
            <div>
                <input type="text"
                placeholder='Digite o nome do produto'
                value = {busca}
                onChange = {(evento) => setBusca(evento.target.value)}
                onKeyUp= {(evento) => atualizarBusca(busca)} />
            </div>
            {produtosBuscados.map((produto, index)=>(
                    <div className = "listaIn" key = {index}>
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
            ))
            }
        </div>
        </>
    )
}

export default ListaProdutos