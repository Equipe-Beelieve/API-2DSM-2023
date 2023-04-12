import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import logo from '../images/logo.png'
import verificaLogado from '../funcoes/verificaLogado';
import api from '../services/api';

function NavBar(){
    const [logado, setLogado] = useState(Boolean)
    const [funcao, setFuncao] = useState('')
    const navegate = useNavigate()

    async function veLogado(){
        let dadoUsuario = await api.get('/confereLogado')
        if (dadoUsuario.data.logado){
            setLogado(true)
            setFuncao(dadoUsuario.data.funcao)
            console.log(funcao)
        }
        else{
            setLogado(false)
        }

    }

    async function loggout() {
        const log = await api.get('/loggout')
        console.log(log.data)
        navegate('/')
    }

    useEffect(()=>{
        veLogado()
    })
    if (logado){
        if (funcao == 'Administrador'){
            return(
                <nav className="navbar navbar-dark navbar-expand-lg bg_navbar">
                    <Link className="navbar-brand text_navbar"  to={'/listaPedidos'}><img className="nav-logo" src={logo} alt=""/></Link>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div className="navbar-nav navbar_itens nav-texts">
                            <Link className="nav-item nav-link" to={'/listaPedidos'}>Pedidos</Link>
                            <Link className="nav-item nav-link" to={'/listaFornecedor'}>Fornecedores</Link>
                            <Link className="nav-item nav-link" to={'/listaProduto'}>Produtos</Link>
                            <Link className="nav-item nav-link" to={'/listaUsuario'}>Usuarios</Link>
                            <button className='loggout' onClick={loggout}>LOGGOUT</button>
                        </div> 
                    </div>
                </nav>
            )
        }
        else if (funcao == 'Gerente'){
            return(
                <nav className="navbar navbar-dark navbar-expand-lg bg_navbar">
                    <Link className="navbar-brand text_navbar"  to={'/listaPedidos'}><img className="nav-logo" src={logo} alt=""/></Link>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div className="navbar-nav navbar_itens nav-texts">
                            <Link className="nav-item nav-link" to={'/listaPedidos'}>Pedidos</Link>
                            <Link className="nav-item nav-link" to={'/listaFornecedor'}>Fornecedores</Link>
                            <Link className="nav-item nav-link" to={'/listaProduto'}>Produtos</Link>
                            <button className='loggout' onClick={loggout}>LOGGOUT</button>
                        </div>  
                    </div>
                </nav>
            )
        }
        else{
            return(
                <nav className="navbar navbar-dark navbar-expand-lg bg_navbar">
                    <Link className="navbar-brand text_navbar"  to={'/listaPedidos'}><img className="nav-logo" src={logo} alt=""/></Link>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div className="navbar-nav navbar_itens nav-texts">
                            <Link className="nav-item nav-link" to={'/listaPedidos'}>Pedidos</Link>
                            <button onClick={loggout}>LOGGOUT</button>
                        </div>  
                    </div>
                </nav>
            )
            
        }
        
    }
    return null
}

export default NavBar