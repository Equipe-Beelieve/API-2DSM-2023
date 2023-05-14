import React from 'react';
import { useState, useEffect } from 'react';
import cadastro from '../images/cadastro.png';
import pesquisa from '../images/pesquisa.png';
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import verificaLogado from '../funcoes/verificaLogado';
import NavBar from './NavBar';
import unidecode from 'unidecode';


export interface Fornecedor {
    for_codigo: number;
    for_cnpj: string;
    for_razao_social: string;
    for_nome_fantasia: string;
    end_cep: string;
}

function ListaFornecedor() {
    const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])
    const [logado, setLogado] = useState(Boolean)
    const [renderizou, setRenderizou] = useState(false)
    const navegate = useNavigate()

    const [busca, setBusca] = useState('') //state para armazenar o termo da busca do usuário
    const [fornecedoresBuscados, setFornecedoresBuscados] = useState<Fornecedor[]>([]) //state para armazenar os resultados correspondentes da busca

    async function getFornecedores() {
        try {
            const response = await api.get('/listaFornecedores')
            console.log(response.data.tabelaFornecedores)
            setFornecedores(response.data.tabelaFornecedores)
        } catch (erro) {
            console.log(erro)
        }
    }

    function buscarFornecedores(fornecedores: Fornecedor[], busca: string) { // função que filtra os pedidos de acordo com o termo da busca
        let buscaMinusc = busca.toLowerCase() //normalizando o texto para a busca não ser Case sensitive e nem precisar dos acentos corretos
        let buscaNormalizada = unidecode(buscaMinusc)
        return fornecedores.filter((fornecedor) => {
            const razaoSocial = unidecode(fornecedor.for_razao_social.toLowerCase()).includes(buscaNormalizada) //cada variável testa a ocorrência em um campo específico
            const codigoFornecedor = fornecedor.for_codigo.toLocaleString().includes(buscaNormalizada)
            const nomeFantasia = unidecode(fornecedor.for_nome_fantasia.toLowerCase()).includes(buscaNormalizada)
            return razaoSocial || codigoFornecedor || nomeFantasia //retorna os pedidos cujo a busca se encaixe em pelo menos um campo definido
        })
    }

    function atualizarBusca(busca: string) {
        const buscaFornecedores = buscarFornecedores(fornecedores, busca)
        setFornecedoresBuscados(buscaFornecedores)
    }

    useEffect(() => {
        async function veLogado() {
            let resultado = await verificaLogado()
            //setLogado(resultado)
            if (resultado.logado) {
                getFornecedores();
                atualizarBusca(busca)
                if (resultado.funcao !== 'Administrador' && resultado.funcao !== 'Gerente') {
                    navegate('/listaPedidos')
                }

            }
            else {
                navegate('/')
            }
        }
        veLogado()


    }, [fornecedores, busca]) //Aciona as funções apenas quando a página é renderizada

    useEffect(() => { // Garante uma segunda renderização para que nenhum pedido fique fora
        if (!renderizou) {
            getFornecedores()
            console.log('FOI 1')
            setRenderizou(true)
        } else {
            console.log('FOI 2')
            return;
        }
    }, [renderizou])

    return (
        <>
            <NavBar />
            <div className='mainContent'>
                <div className="centralizaTitulo" >
                    <h1 className="mainTitle">FORNECEDORES</h1>
                    <button id="register">
                        <Link to={'/cadastroFornecedor'} id='linkBotaoCadastro'>
                            <img className="cadastro" src={cadastro} alt="" />
                        </Link>
                    </button>
                </div>
                <div>
                        <input type="text" className="termo-pesquisa" id="imagem-pesquisa"
                            placeholder='Digite o nome do fornecedor'
                            value={busca}
                            onChange={(evento) => setBusca(evento.target.value)}
                            onKeyUp={(evento) => atualizarBusca(busca)}
                        />
                </div>
                {fornecedoresBuscados.map((fornecedor, index) => (
                    <div className="listaIn" key={index}>
                        <h1>Fornecedor nº{fornecedor.for_codigo}</h1>
                        <div className="listColumns">
                            <div className="column1_for">
                                <p>Razão social: {fornecedor.for_razao_social}</p>
                                <p>Nome fantasia: {fornecedor.for_nome_fantasia}</p>
                            </div>
                            <div className="column2">
                                <p>CNPJ: {fornecedor.for_cnpj}</p>
                                <p>CEP: {fornecedor.end_cep}</p>
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