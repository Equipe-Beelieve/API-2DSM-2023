import { useEffect, useState } from 'react';
import React from 'react';
import { RedirectFunction, useParams } from 'react-router-dom';
import api from '../services/api'
import { Link, useNavigate } from 'react-router-dom';
import verificaLogado from '../funcoes/verificaLogado';
import NavBar from './NavBar';
import { Usuarios } from './ListaUsuario'
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import trataCep from './CadFornecedor';
import trataNumero from './CadFornecedor';
import lixeira from '../images/lixeira.png'
import Swal from 'sweetalert2';




function CadUsuario() {

    //================== ESTADOS (states) ==================
    const [nome, setNome] = useState('')
    const [senha, setSenha] = useState('')
    const [funcao, setFuncao] = useState('')
    const [login, setLogin] = useState('')
    const [cep] = useState('')
    const [estado, setEstado] = useState('')
    const [cidade, setCidade] = useState('')
    const [endereco, setEndereco] = useState('')
    const [numero] = useState('')
    const [cpf, setCpf] = useState('')
    const [controleCpf, setControleCpf] = useState(0)
    const [editar, setEditar] = useState<Boolean>(false)
    const [loginInicial, setLoginInicial] = useState('')
    const [funcaoInical, setFuncaoInicial] = useState('')
    const { id } = useParams()

    //================== Tratar login ==================
    const [loginExistente, setLogins] = useState<Usuarios[]>([]) //Logins que virão do bd


    const [logado, setLogado] = useState(Boolean)
    const navegate = useNavigate()


    //================== Função para recuperar os logins existentes ==================
    async function fetchLogin() {
        try {
            const pegar = await api.get('/pegarLogin');
            setLogins(pegar.data.logins);

        } catch (erro) {
            console.log(erro)
        }
    }

    //================== SUBMIT DE FORMULÁRIO ==================   
    async function cadastroUsuario(evento: any) {
        evento.preventDefault();
        if (loginExistente.some(usuario => usuario.us_login === login)) {
            toast.error('Login já cadastrado', { position: 'bottom-left', autoClose: 2500,
            className: 'flash', hideProgressBar: true, pauseOnHover: false, theme: "dark"})

        } else {
            const post = { nome, senha, funcao, login, cep, estado, cidade, endereco, numero, cpf }
            
            await api.post('/cadastroUsuario', { post }).then((resposta) => {navegate('/listaUsuario')})
        }
    }

    //================== Edição ==================
    
    async function resgataValores(){
        await api.post('/resgataValoresUsuario', {id:id}).then((resposta) => {
            console.log(resposta.data)
            //us_matricula, us_nome, us_senha, us_funcao, us_login
            let dado = resposta.data
            setLogin(dado.us_login)
            setNome(dado.us_nome)
            setSenha(dado.us_senha)
            setFuncao(dado.us_funcao)
            setEditar(true)
            setLoginInicial(dado.us_login)
            setFuncaoInicial(dado.us_funcao)
        })
    }

    async function editaUsuario(){
        let idUsuario = id
        if (loginExistente.some(usuario => usuario.us_login === login) && loginInicial !== login) {
            toast.error('Escolha outro login', { position: 'bottom-left', autoClose: 2500,
            className: 'flash', hideProgressBar: true, pauseOnHover: false, theme: "dark"})

        } else {
            const post = { idUsuario, nome, senha, funcao, login}
            
            await api.post('/updateUsuario', { post }).then((resposta) => {navegate('/listaUsuario')})
        }
    }

    //================== Deleta Usuario ==================
    async function confirmarDelete(){
        Swal.fire({
            title: 'Excluir usuário?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#C0C0C0',
            cancelButtonColor: '#3E813B',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Confirmar',
          }).then(async (result) => {
            if (result.isConfirmed) {
              await deleteUsuario()
            }
          })
    }

    async function deleteUsuario(){
        await api.post('/deletaUsuario', {id:id}).then((resposta) => {navegate('/listaUsuario')})
    }



    //================== Função verifica logado (useEffect) ==================
    useEffect(() => {
        async function veLogado() {
            let resultado = await verificaLogado()
            //setLogado(resultado)
            if (resultado.logado) {
                await fetchLogin()
                if (resultado.funcao !== 'Administrador' && resultado.funcao !== 'Gerente') {
                    navegate('/listaPedidos')
                }
            }
            else {
                navegate('/')
            }
        }
        veLogado()

        console.log(editar)

    }, [editar])

    useEffect(() => {
        if(id){
            resgataValores()
        }
        console.log(editar)
    }, [])

    //================== RENDERIZAÇÃO ==================

    return (
        <>
            <NavBar />
            <div className="divFornecedor">
                <div className="flexMainUsuario">
                    <div className='blocoInvisivelUsuarioEsquerda'> </div>
                    {editar && <h1 className='mainTitle'>Edição de Usuario</h1>}
                    {!editar && <h1 className='mainTitle'>Cadastro de Usuario</h1>}
                    {editar && funcaoInical !== 'Administrador' &&
                        <img src={lixeira} id='clicavel' alt="Lixo" className='lixoUsuario' onClick={()=>{confirmarDelete()}} />
                    }
                    {editar && !(funcaoInical !== 'Administrador') &&
                        <div className='blocoInvisivelUsuarioDireita'> </div>
                    }
                    {!editar &&
                        <div className='blocoInvisivelUsuarioDireita'> </div>
                    }
                </div>
                <form onSubmit={cadastroUsuario}>
                    
                    
                    
                    <div className="grid-container poscentralized">
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
                    </div>

                    <div className="grid-container poscentralized">
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

                    </div >

                    {!editar &&
                        <>
                        <button className="cancel_button" type='button' onClick={()=>{navegate('/listaUsuario')}}>
                            Cancelar
                        </button>
                        <input className="confirm_button" type="submit" value="Confirmar" />
                        </>
                    }
                    {editar &&
                        <>
                        <button className="cancel_button" type='button' onClick={()=>{navegate('/listaUsuario')}}>
                            Cancelar
                        </button>
                        <button type='button' className="confirm_button" onClick={editaUsuario}>Editar</button>
                        </>
                    }
                    

                </form >
            </div >
        </>

    )
}

export default CadUsuario

