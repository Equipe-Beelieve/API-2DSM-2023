import React from 'react';
import { useState, useEffect } from 'react';
import cadastro from '../images/cadastro.png'
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import verificaLogado from '../funcoes/verificaLogado';
import NavBar from './NavBar';
import unidecode from 'unidecode';

export interface Usuarios {
    us_matricula:number;
    us_nome:string;
    us_funcao:string;
    us_login:string;
}

function ListaUsuario(){
    const [usuarios, setUsuarios] = useState<Usuarios[]>([])
    const [logado, setLogado] = useState(Boolean)
    const [renderizou, setRenderizou] = useState(false)
    const navegate = useNavigate()

    const [busca, setBusca] = useState('') //state para armazenar o termo da busca do usuário
    const [usuariosBuscados, setUsuariosBuscados] = useState<Usuarios[]>([]) //state para armazenar os resultados correspondentes da busca

    async function getUsuario(){
        try {
            const response = await api.get('/listarUsuario')
            console.log(response.data.tabelaUsuario)
            setUsuarios(response.data.tabelaUsuario)
            }
            catch (erro) {
            console.log(erro)
            }
    }

    function buscarUsuarios(usuarios:Usuarios[], busca:string) { // função que filtra os pedidos de acordo com o termo da busca
        let buscaMinusc = busca.toLowerCase() //normalizando o texto para a busca não ser Case sensitive e nem precisar dos acentos corretos
        let buscaNormalizada = unidecode(buscaMinusc)
        return usuarios.filter((usuario) => {
            const nomeUsuario = unidecode(usuario.us_nome.toLowerCase()).includes(buscaNormalizada) //cada variável testa a ocorrência em um campo específico
            const codigoUsuario = usuario.us_matricula.toLocaleString().includes(buscaNormalizada)
            const loginUsuario = unidecode(usuario.us_login.toLowerCase()).includes(buscaNormalizada)
            const cargoUsuario = unidecode(usuario.us_funcao.toLowerCase()).includes(buscaNormalizada)
            return nomeUsuario || codigoUsuario || loginUsuario || cargoUsuario //retorna os pedidos cujo a busca se encaixe em pelo menos um campo definido
        })
    }

    function atualizarBusca(busca:string) {
        const buscaUsuarios = buscarUsuarios(usuarios, busca)
        setUsuariosBuscados(buscaUsuarios)
    }

    useEffect(()=>{
        async function veLogado(){
            let resultado = await verificaLogado()
            //setLogado(resultado)
            if (resultado.logado){
                getUsuario();
                atualizarBusca(busca)
                if (resultado.funcao !== 'Administrador'){
                    navegate('/listaPedidos')
                }
            }
            else{
                navegate('/')
            }
        }
        veLogado()

    }, [busca, navegate, usuarios])

    useEffect(()=>{ // Garante uma segunda renderização para que nenhum pedido fique fora
        if (!renderizou){
            getUsuario()
            console.log('FOI 1')
            setRenderizou(true)
        }else{
            console.log('FOI 2')
            return;
    }}, [renderizou])



    return(
        <>
        <NavBar />
        <div className="mainContent">
            <div className="titleRegister">
                <h1 className="mainTitle">USUÁRIOS</h1>
                <button id="register">
                        <Link to={'/cadastroUsuario'} id='linkBotaoCadastro'>
                            <img className="cadastro" src={cadastro} alt=""/>
                        </Link>
                </button>
            </div>
            <div>
                <input type="text" className="termo-pesquisa" id="imagem-pesquisa"
                placeholder='Digite o nome do usuario'
                value = {busca}
                onChange = {(evento) => setBusca(evento.target.value)}
                onKeyUp= {(evento) => atualizarBusca(busca)} />
            </div>
            {usuariosBuscados.map((usuario, index) => (
                    <div className="listaIn" key={index}>
                        <h1>
                            Matricula nº{usuario.us_matricula}
                        </h1>
                        <div className="listColumns">
                            <div className="column1">
                                <p>Nome: {usuario.us_nome}</p>
                                <p>Login: {usuario.us_login}</p>
                                
                            </div>
                            <div className="column2">
                                <p>Função: {usuario.us_funcao}</p>
                            </div>
                        </div>
                    </div>
            ))
            }
        </div>
        </>
    )
}



export default ListaUsuario