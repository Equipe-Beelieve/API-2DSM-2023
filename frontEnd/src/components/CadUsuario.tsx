import { useEffect, useState } from 'react';
import React from 'react';
import { RedirectFunction } from 'react-router-dom';
import api from '../services/api'
import { Link, useNavigate } from 'react-router-dom';
import verificaLogado from '../funcoes/verificaLogado';
import NavBar from './NavBar';

function CadUsuario() {

    //================== ESTADOS (states) ==================
    const [nome, setNome] = useState('')
    const [senha, setSenha] = useState('')
    const [funcao, setFuncao] = useState('')
    const [login, setLogin] = useState('')

    const [logado, setLogado] = useState(Boolean)
    const navegate = useNavigate()

    
    //================== SUBMIT DE FORMULÁRIO ==================   
    function cadUsuario(evento:any){
        evento.preventDefault();
        const post = {nome, senha, funcao, login}
        console.log({nome, senha,funcao, login})
        const jsonCadFor = JSON.stringify(post)
        api.post('/cadastroUsuario', 
        {post}
        );
        navegate('/listaUsuario')
    }

    
    
    //================== Função para não repetir login ==================

   
    //================== REENDERIZAÇÃO ==================

    return (
        <>
        <NavBar />
        <div className="divFornecedor">
        <form onSubmit={cadUsuario}>
            <h1>Cadastro de Usuario ninja</h1>                
                <div className="grid-container poscentralized">
                    <div className="box">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nome :</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><input className="input_form" type="text" id="for_nome" name="for_nome"
                                        required
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="box">
                        <table>
                            <thead>
                                <tr>
                                    <th>Senha :</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><input className="input_form" type="text" id="for_senha"
                                        name="for_senha" required
                                        value={senha}
                                        onChange={(e) => setSenha(e.target.value)} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="box">
                        <table>
                            <thead>
                                <tr>
                                    <th>Função :</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <td><select className="input_form" name="end_estado" id="end_estado" required
                                        value={funcao}
                                        onChange={(e) => setFuncao(e.target.value)}>
                                            <option value="Administrador">Administrador</option>
                                            <option value="Gerente">Gerente</option>
                                            <option value="Conferente">Conferente</option>
                                        </select>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="box">
                        <table>
                            <thead>
                                <tr>
                                    <th>Login :</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><input className="input_form" type="text" id="for_login"
                                        name="for_login" required
                                        value={login}
                                        onChange={(e) => setLogin(e.target.value)} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                

                <input className="confirm_button" type="submit" value="Cadastrar" />

                <button className="cancel_button">
                    <Link to={'/listaUsuario'}>Cancelar</Link>
                </button>
            
                </form>
    </div>
    </>
        
    )
}

export default CadUsuario

