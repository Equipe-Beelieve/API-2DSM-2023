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
    const navegate = useNavigate()

    async function getUsuario(){
        try {
            const response = await api.get('/listaUsuario')
            console.log(response.data.tabelaUsario)
            setUsuarios(response.data.tabelaUsario)
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





    return(
        <>
        <NavBar />
        <div className="mainContent">
            <div className="titleRegister">
                <h1 className="mainTitle">Usuarios</h1>
                <button id="register">
                        <Link to={'/'}>
                            <img className="cadastro" src={cadastro} alt=""/>
                        </Link>
                </button>
            </div>
            {usuarios.map((usuario, index) => (
                <div className='listaOut' key={index}>
                    <div className="listaIn">
                        <h1>Pedido nº{usuario.us_matricula}</h1>
                        <div className="listColumns">
                            <div className="column1">
                                <p>Peso: {usuario.us_nome}</p>
                                <p>Data de entrega: {usuario.us_funcao}</p>
                            </div>
                            <div className="column2">
                                <p>Valor total: {usuario.us_login}</p>
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