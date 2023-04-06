import React from 'react';
import { useState } from 'react';
import logo from '../images/logo.png'

function NavBar(){
    return(
        <nav className="navbar navbar-dark navbar-expand-lg bg_navbar">
            <a className="navbar-brand text_navbar"  href="#"><img className="nav-logo" src={logo} alt=""/></a>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav navbar_itens nav-texts">
                    <a className="nav-item nav-link" href="#">Pedidos</a>
                    <a className="nav-item nav-link" href="#">Fornecedores</a>
                    <a className="nav-item nav-link" href="#">Produtos</a>
                    <a className="nav-item nav-link" href="#">Usuarios</a>
                </div>
            </div>
        </nav>
    )
}

export default NavBar