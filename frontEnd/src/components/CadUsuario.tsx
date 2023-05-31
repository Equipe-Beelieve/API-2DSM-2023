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
    const [mesmoUsuario, setMesmoUsuario] = useState(false)
    const [quantidadeAdministrador, setQuantidadeAdministrador] = useState<number>(1)
    const [ativo, setAtivo] = useState('')
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
            console.log(resposta.data.usuario)
            console.log(resposta.data.quantidadeFuncaoAdministrador)
            console.log(resposta.data.mesmoUsuario)
            
            //us_matricula, us_nome, us_senha, us_funcao, us_login
            let dado = resposta.data.usuario
            console.log(dado.us_funcao)
            setLogin(dado.us_login)
            setNome(dado.us_nome)
            setSenha(dado.us_senha)
            setFuncao(dado.us_funcao)
            setAtivo(dado.us_ativo)
            setEditar(true)
            setLoginInicial(dado.us_login)
            setFuncaoInicial(dado.us_funcao)
            setQuantidadeAdministrador(resposta.data.quantidadeFuncaoAdministrador["COUNT('us_funcao')"])
            setMesmoUsuario(resposta.data.mesmoUsuario)
        })
    }

    async function editaUsuario(){
        let idUsuario = id
        if (loginExistente.some(usuario => usuario.us_login === login) && loginInicial !== login) {
            toast.error('Escolha outro login', { position: 'bottom-left', autoClose: 2500,
            className: 'flash', hideProgressBar: true, pauseOnHover: false, theme: "dark"})

        } 
        else if (funcao === ''){
            toast.error('Escolha uma função', { position: 'bottom-left', autoClose: 2500,
            className: 'flash', hideProgressBar: true, pauseOnHover: false, theme: "dark"})
        }
        else {
            const post = { dados:{idUsuario, nome, senha, funcao, login}, mesmoUsuario:mesmoUsuario}
            
            await api.post('/updateUsuario', { post }).then((resposta) => {navegate('/listaUsuario')})
        }
    }

    //================== Deleta Usuario ==================
    async function confirmarDelete(acao:string){
        if(acao === "Desativar"){
            Swal.fire({
                title: `Desativar usuário?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3E813B',
                cancelButtonColor: '#5D5D5D',
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Confirmar',
              }).then(async (result) => {
                if (result.isConfirmed) {
                  await desativaUsuario()
                }
              })
        }
        else if (acao === "Ativar"){
            Swal.fire({
                title: `Ativar usuário?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3E813B',
                cancelButtonColor: '#5D5D5D',
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Confirmar',
              }).then(async (result) => {
                if (result.isConfirmed) {
                  await ativaUsuario()
                }
              })
        }
        else{
            Swal.fire({
                title: `O Administrador não pode ser desativado.`,
                icon: 'warning',
                confirmButtonColor: '#5D5D5D',
                confirmButtonText: 'Voltar',
              })
        }
        
    }

    async function desativaUsuario(){
        await api.post('/desativaUsuario', {id:id}).then((resposta) => {setAtivo("Desativado")})
    }

    async function ativaUsuario() {
        await api.post('/ativaUsuario', {id:id}).then((resposta) => {setAtivo("Ativado")})
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
                    {editar && funcaoInical !== 'Administrador' && ativo === "Ativado" &&
                        
                        <button className="ativado" onClick={()=>{confirmarDelete('Desativar')}}>Ativado</button>                        
                        
                    }
                    {editar && funcaoInical !== 'Administrador' && ativo === "Desativado" &&
                        
                        <button className="desativado" onClick={()=>{confirmarDelete('Ativar')}}>Desativado</button>
                        
                    }
                    {editar && funcaoInical === 'Administrador' &&
                        <button className="ativado" onClick={()=>{confirmarDelete('naoPrermite')}}>Ativado</button>
                    }
                    {!editar &&
                        <div className='blocoInvisivelUsuarioDireita'> </div>
                    }
                </div>
                <form className='responsividadeforms' onSubmit={cadastroUsuario} action="/action_page.php">
                    
                    
                    
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
                                        {editar &&
                                            <td>
                                                <input title='não é possivel editar' className="input_form" type="text" id="for_login"
                                                name="for_login" required
                                                value={login}
                                                onChange={(e) => setLogin(e.target.value)} 
                                                disabled
                                                />
                                            </td>
                                        }
                                        {!editar &&
                                            <td>
                                                <input title='não é possivel editar' className="input_form" type="text" id="for_login"
                                                name="for_login" required
                                                value={login}
                                                onChange={(e) => setLogin(e.target.value)} 
                                                />
                                            </td>
                                        }
                                        
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
                                        {editar &&
                                            <td>
                                                <input title='não é possivel editar' className="input_form" type="text" id="for_nome" name="for_nome"
                                                required
                                                value={nome}
                                                onChange={(e) => setNome(e.target.value)} 
                                                disabled/>
                                            </td>
                                        }
                                        {!editar &&
                                            <td>
                                                <input title='não é possivel editar' className="input_form" type="text" id="for_nome" name="for_nome"
                                                required
                                                value={nome}
                                                onChange={(e) => setNome(e.target.value)} 
                                                />
                                            </td>
                                        }
                                        
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
                                        <td>
                                            {((quantidadeAdministrador > 1 && funcaoInical === "Administrador" && !mesmoUsuario) || (funcaoInical !== "Administrador")) && 
                                                <select className="input_form" name="end_estado" id="end_estado" required
                                                value={funcao}
                                                onChange={(e) => setFuncao(e.target.value)}>
                                                <option value=""></option>
                                                <option value="Gerente">Gerente</option>
                                                <option value="Conferente">Conferente</option>
                                                </select>
                                            }
                                            {(mesmoUsuario || quantidadeAdministrador <= 1) && (funcaoInical === 'Administrador') &&
                                                <select className='input_form' name="end_estado" id="end_estado" value={funcao}>
                                                    <option value={funcao}>{funcao}</option>
                                                </select>
                                            }
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

