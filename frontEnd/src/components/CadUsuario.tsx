import { useEffect, useState } from 'react';
import React from 'react';
import { RedirectFunction } from 'react-router-dom';
import api from '../services/api'
import { Link, useNavigate } from 'react-router-dom';
import verificaLogado from '../funcoes/verificaLogado';
import NavBar from './NavBar';
import { Usuarios } from './ListaUsuario'
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";



function CadUsuario() {

    //================== ESTADOS (states) ==================
    const [nome, setNome] = useState('')
    const [senha, setSenha] = useState('')
    const [funcao, setFuncao] = useState('')
    const [login, setLogin] = useState('')
    //================== Tratar login ==================
    const [loginExistente, setLogins] = useState<Usuarios[]>([]) //Logins que virão do bd


    const [logado, setLogado] = useState(Boolean)
    const navegate = useNavigate()

    
    //================== Função para recuperar os logins existentes ==================
    async function fetchLogin() {
        try {
        const pegar = await api.get('/pegarLogin');
          setLogins(pegar.data.logins);
          
        } catch(erro) {
            console.log(erro)
        }
    }

    //================== SUBMIT DE FORMULÁRIO ==================   
    async function cadastroUsuario(evento:any){
        evento.preventDefault();
        await fetchLogin()
        if (loginExistente.some(usuario => usuario.us_login === login)) {
            toast.error('Login já cadastrado', {position: 'bottom-left', autoClose: 2500, className: 'flash', hideProgressBar: true, pauseOnHover: false})
        
        } else {
            const post = {nome, senha, funcao, login}
            navegate('/listaUsuario')
            await api.post('/cadastroUsuario', {post});
        }
    }
    
    
    //================== Função verifica logado (useEffect) ==================
    useEffect(()=>{
        async function veLogado(){
            let resultado = await verificaLogado()
            //setLogado(resultado)
            if (resultado.logado){
                await fetchLogin()
                if (resultado.funcao !== 'Administrador' && resultado.funcao !== 'Gerente'){
                    navegate('/listaPedidos')
                }
            }
            else{
                navegate('/')
            }
        }
        veLogado()
        
    }, [])
        
   
    //================== REENDERIZAÇÃO ==================

    return (
        <>
        <NavBar />
        <div className="divFornecedor">
        <form onSubmit={cadastroUsuario}>
            <h1>Cadastro de Usuario</h1>                
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
                                            <option value=""></option>
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

