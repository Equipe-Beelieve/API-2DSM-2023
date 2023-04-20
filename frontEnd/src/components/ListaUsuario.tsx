import React from 'react';
import { useState, useEffect } from 'react';
import cadastro from '../images/cadastro.png'
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import verificaLogado from '../funcoes/verificaLogado';
import NavBar from './NavBar';


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

        

        useEffect(()=>{
            async function veLogado(){
                let resultado = await verificaLogado()
                //setLogado(resultado)
                if (resultado.logado){
                    getUsuario();
                    if (resultado.funcao !== 'Administrador'){
                        navegate('/listaPedidos')
                    }
                }
                else{
                    navegate('/')
                }
            }
            veLogado()

        }, [])

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
                        <Link to={'/cadastroUsuario'}>
                            <img className="cadastro" src={cadastro} alt=""/>
                        </Link>
                </button>
            </div>
            {usuarios.map((usuario, index) => (
                <div className='listaOut' key={index}>
                    <div className="listaIn">
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
                </div>
            ))
            }
        </div>
        </>
    )
}



export default ListaUsuario