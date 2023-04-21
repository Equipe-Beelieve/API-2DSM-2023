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
import trataCep from './CadFornecedor';
import trataNumero from './CadFornecedor';



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
        await fetchLogin()
        if (loginExistente.some(usuario => usuario.us_login === login)) {
            toast.error('Login já cadastrado', { position: 'bottom-left', autoClose: 2500, className: 'flash', hideProgressBar: true, pauseOnHover: false })

        } else {
            const post = { nome, senha, funcao, login, cep, estado, cidade, endereco, numero, cpf }
            navegate('/listaUsuario')
            await api.post('/cadastroUsuario', { post });
        }
    }

    //================MÁSCARAS DE FORMULLÁRIO========================

    function trataCpf(evento: any) {
        let valor = evento.target.value
        if (isNaN(valor[valor.length - 1]) && valor[valor.length - 1] !== '.' && valor[valor.length - 1] !== '-' && valor[valor.length - 1] !== undefined) {
            console.log(valor[valor.length - 1])
            setCpf(cpf)
        }
        else {
            // console.log(controleCpf)
            // console.log(valor.length)
            console.log(`valor.length: ${valor.length}`)
            if (valor.length < 3) {
                setCpf(valor)
                setControleCpf(0)
            }
            else if (valor.length === 3 && controleCpf < 2) {
                setCpf(valor + '.')
                setControleCpf(3)
            }
            else if (valor.length === 4 && valor[valor.length - 1] !== '.') {
                setCpf(cpf + '.' + valor[valor.length - 1])
                setControleCpf(3)
            }
            else if (valor.length < 7) {
                setCpf(valor)
                setControleCpf(3)
            }
            else if (valor.length === 7 && controleCpf < 6) {
                setCpf(valor + '.')
                setControleCpf(7)
            }
            else if (valor.length === 8 && valor[valor.length - 1] !== '.') {
                setCpf(cpf + '.' + valor[valor.length - 1])
                setControleCpf(7)
            }
            else if (valor.length < 11) {
                setCpf(valor)
                setControleCpf(7)
            }
            else if (valor.length === 11 && controleCpf < 10) {
                setCpf(valor + '-')
                setControleCpf(11)
            }
            else if (valor.length === 12 && valor[valor.length - 1] !== '-') {
                setCpf(cpf + '-' + valor[valor.length - 1])
                setControleCpf(11)
            }
            else {
                setCpf(valor)
            }
        }
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

    }, [])


    //================== RENDERIZAÇÃO ==================

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
                        <div className="box leftAlign">
                            <table>
                                <thead>
                                    <tr>
                                        <th>CPF:</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><input className="input_form" type="text" placeholder="000.000.000-00"
                                            minLength={14}
                                            maxLength={14}
                                            id="for_cpf"
                                            name="for_cpf" required
                                            value={cpf} onChange={trataCpf} />
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

                        <div className="box">
                            <table>
                                <thead>
                                    <tr>
                                        <th>CEP:</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><input className="input_form" type="text" placeholder="00000-000"
                                            id="end_cep" name="end_cep" minLength={9} maxLength={9} required
                                            value={cep}
                                            onChange={trataCep} /></td>
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
                                        <th>Estado:</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><select className="input_form" name="end_estado" id="end_estado" required
                                            value={estado}
                                            onChange={(e) => setEstado(e.target.value)}>
                                            <option value=""></option>
                                            <option value="Acre">Acre</option>
                                            <option value="Alagoas">Alagoas</option>
                                            <option value="Amapá">Amapá</option>
                                            <option value="Amazonas">Amazonas</option>
                                            <option value="Bahia">Bahia</option>
                                            <option value="Ceará">Ceará</option>
                                            <option value="Distrito Federal">Distrito Federal</option>
                                            <option value="Espírito Santo">Espírito Santo</option>
                                            <option value="Goiás">Goiás</option>
                                            <option value="Maranhão">Maranhão</option>
                                            <option value="Mato Grosso">Mato Grosso</option>
                                            <option value="Mato Grosso do Sul">Mato Grosso do Sul</option>
                                            <option value="Minas Gerais">Minas Gerais</option>
                                            <option value="Pará">Pará</option>
                                            <option value="Paraíba">Paraíba</option>
                                            <option value="Paraná">Paraná</option>
                                            <option value="Pernambuco">Pernambuco</option>
                                            <option value="Piauí">Piauí</option>
                                            <option value="Rio de Janeiro">Rio de Janeiro</option>
                                            <option value="Rio Grande do Norte">Rio Grande do Norte</option>
                                            <option value="Rio Grande do Sul">Rio Grande do Sul</option>
                                            <option value="Rondônia">Rondônia</option>
                                            <option value="Roraima">Roraima</option>
                                            <option value="Santa Catarina">Santa Catarina</option>
                                            <option value="São Paulo">São Paulo</option>
                                            <option value="Sergipe">Sergipe</option>
                                            <option value="Tocantins">Tocantins</option>
                                        </select>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="box">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Cidade:</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><input className="input_form" type="text" id="end_cidade" name="end_cidade" required
                                            value={cidade}
                                            onChange={(a) => setCidade(a.target.value)} />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="box">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Endereço:</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><input className="input_form" type="text" id="endereco" name="endereco" required
                                            value={endereco}
                                            onChange={(a) => setEndereco(a.target.value)} />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className='poscentralized'>
                        <div className="box">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Número:</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><input value={numero} onChange={trataNumero} className="input_form" type="text" id="end_numero" name="end_numero"
                                            maxLength={5} required />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div >

                    <input className="confirm_button" type="submit" value="Cadastrar" />

                    <button className="cancel_button">
                        <Link to={'/listaUsuario'}>Cancelar</Link>
                    </button>

                </form >
            </div >
        </>

    )
}

export default CadUsuario

