import React from 'react';
import { useState, useEffect } from 'react';
import cadastro from '../images/cadastro.png'
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import verificaLogado from '../funcoes/verificaLogado';
import NavBar from './NavBar';


interface Usuario {
    us_matricula:number
    us_nome:string
    us_senha:string
    us_funcao:string
    us_login:string
}

function ListaUsuario(){
    const [usuario, setUsuario] = useState<Usuario[]>([])
    const [logado, setLogado] = useState(Boolean)
    const navegate = useNavigate()

    async function getUsuario(){
        try {
            const response = await api.get('/listaUsuario')
            console.log(response.data.tabelaUsario)
            setUsuario(response.data.tabelaUsario)
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
                    if (resultado.funcao != 'Administrador'){
                        navegate('/listaPesdidos')
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
        <center>
            <h1 className="mainTitle">Usuarios</h1>
        </center>

        </>
    )
}



export default ListaUsuario