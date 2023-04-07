import React from 'react';
import { Link } from 'react-router-dom'
import logo from '../images/logo.png'

function NavBar(){
    return(
        <nav className="navbar navbar-dark navbar-expand-lg bg_navbar">
            <Link className="navbar-brand text_navbar"  to={'/'}><img className="nav-logo" src={logo} alt=""/></Link>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav navbar_itens nav-texts">
                    <Link className="nav-item nav-link" to={'/'}>Pedidos</Link>
                    <Link className="nav-item nav-link" to={'/listaFornecedor'}>Fornecedores</Link>
                    <Link className="nav-item nav-link" to={'/listaProduto'}>Produtos</Link>
                    <Link className="nav-item nav-link" to={'/listaUsuario'}>Usuarios</Link>
                </div>
            </div>
        </nav>
    )
}

export default NavBar