import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import logo from '../images/logo.png'
import verificaLogado from '../funcoes/verificaLogado';
import api from '../services/api';

function NavBar(){
    const [logado, setLogado] = useState(Boolean)
    const [funcao, setFuncao] = useState('')
    const navigate = useNavigate()

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
        navigate('/')
    }

    useEffect(()=>{
        veLogado()
    })
    if (logado){
        if (funcao === 'Administrador'){
            return(
                <nav className="navbar navbar-dark navbar-expand-lg bg_navbar d-flex justify-content-between">
                    <Link className="navbar-brand text_navbar"  to={'/listaPedidos'}><img className="nav-logo" src={logo} alt=""/></Link>
                    <div className="navbar-nav navbar_itens nav-texts ">
                        <Link className="nav-item nav-link" to={'/listaPedidos'}>Pedidos</Link>
                        <Link className="nav-item nav-link" to={'/listaFornecedor'}>Fornecedores</Link>
                        <Link className="nav-item nav-link" to={'/listaProdutos'}>Produtos</Link>
                        <Link className="nav-item nav-link" to={'/listaUsuario'}>Usuarios</Link>
                    </div> 
                    <button className='loggout' onClick={loggout}>LOGGOUT</button>
                </nav>
            )
        }
        else if (funcao === 'Gerente'){
            return(
                <nav className="navbar navbar-dark navbar-expand-lg bg_navbar d-flex justify-content-between">
                    <Link className="navbar-brand text_navbar"  to={'/listaPedidos'}><img className="nav-logo" src={logo} alt=""/></Link>
                    <div className="navbar-nav navbar_itens nav-texts">
                        <Link className="nav-item nav-link" to={'/listaPedidos'}>Pedidos</Link>
                        <Link className="nav-item nav-link" to={'/listaFornecedor'}>Fornecedores</Link>
                        <Link className="nav-item nav-link" to={'/listaProdutos'}>Produtos</Link>
                    </div>  
                    {/* <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div className="navbar-nav navbar_itens nav-texts">
                            <Link className="nav-item nav-link" to={'/listaPedidos'}>Pedidos</Link>
                            <Link className="nav-item nav-link" to={'/listaFornecedor'}>Fornecedores</Link>
                            <Link className="nav-item nav-link" to={'/listaProdutos'}>Produtos</Link>
                        </div>  
                    </div> */}
                    <button className='loggout' onClick={loggout}>LOGGOUT</button>
                </nav>
            )
        }
        else{
            return(
                <nav className="navbar navbar-dark navbar-expand-lg bg_navbar d-flex justify-content-between">
                    <Link className="navbar-brand text_navbar"  to={'/listaPedidos'}><img className="nav-logo" src={logo} alt=""/></Link>
                    <button className='loggout' onClick={loggout}>LOGGOUT</button>
                </nav>
            )
            
        }
        
    }
    return null
}

export default NavBar