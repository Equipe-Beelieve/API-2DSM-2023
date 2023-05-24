import { useEffect, useRef, useState } from 'react';
import api from '../services/api'
import { Link, useNavigate, useParams } from 'react-router-dom';
import verificaLogado from '../funcoes/verificaLogado';
import NavBar from './NavBar';
import { toast } from 'react-toastify';

function CadFornecedor() {

    //================== ESTADOS (states) ==================
    const [razaoSocial, setRazaoSocial] = useState('')
    const [nomeFantasia, setNomeFantasia] = useState('')
    const [cnpj, setCnpj] = useState('')
    const [cidade, setCidade] = useState('')
    const [cep, setCep] = useState('')
    const [estado, setEstado] = useState('')
    const [bairro, setBairro] = useState('')
    const [ruaAvenida, setRuaAvenida] = useState('')
    const [numero, setNumero] = useState('')
    const [controleCnpj, setControleCnpj] = useState(0)
    const [editar, setEditar] = useState(false)
    const {id} = useParams()

    const [logado, setLogado] = useState(Boolean)

    const navegate = useNavigate()
    const cnpjRef = useRef(null)
    const cepRef = useRef(null)
    

    
    //================== SUBMIT DE FORMULÁRIO ==================   
    async function cadastraFornecedor(evento:any){
        let regexCep = /^\d{5}\-\d{3}$/
        let regexCnpj = /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/
        let erroCep = false
        let erroCnpj = false

        if (!regexCnpj.test(cnpj)){
            toast.error('O CNPJ deve ser: XX.XXX.XXX/XXXX-XX', {position: 'bottom-left', autoClose: 5000,
            className: 'flash', hideProgressBar: true, pauseOnHover: false, theme: "dark"})
            erroCnpj = true
      
        }
        if (!regexCep.test(cep)){
            toast.error("O CEP deve ser: XXXXX-XX", {position: 'bottom-left', autoClose: 5000,
            className: 'flash', hideProgressBar: true, pauseOnHover: false, theme: "dark"})
            erroCep = true
        }
        
        if (!regexCnpj.test(cnpj) || !regexCep.test(cep)){
            if (erroCnpj){setCnpj('')}
            if (erroCep){setCep('')}
            evento.preventDefault()
        }
        else{
            const post = {cnpj, cep, estado, cidade, bairro, numero, ruaAvenida, razaoSocial, nomeFantasia}
            
            await api.post('/cadastroFornecedor', {post}).then((resposta) => {navegate('/listaFornecedor')})
        } 
    }

    
    //================== MASCARAS DE FORMULÁRIO ==================

    function trataCnpj(evento:any){
        let valor = evento.target.value
        if(isNaN(valor[valor.length-1]) && valor[valor.length-1] !== '.' && valor[valor.length-1] !== '-' && valor[valor.length-1] !== '/' && valor[valor.length-1] !== undefined){
            setCnpj(cnpj)
        }
        else if (valor.length !== 3 && valor.length !== 7 && valor.length !== 11 && valor.length !== 16 && isNaN(valor.slice(-1))){
            setCnpj(cnpj)
        }
        else{
            // console.log(controleCnpj)
            // console.log(valor.length)
            console.log(`valor.length: ${valor.length}`)
            if (valor.length < 2){
                setCnpj(valor)
                setControleCnpj(0)
            }
            else if(valor.length === 2 && controleCnpj < 2) {
                setCnpj(valor + '.')
                setControleCnpj(2)
            }
            else if(valor.length === 3 && valor[valor.length-1] !== '.'){
                setCnpj(cnpj + '.' + valor[valor.length-1])
                setControleCnpj(2)
            }
            else if (valor.length > 3 && valor[2] !== '.'){

                setCnpj('')
                toast.warning('Siga o padrão: XX.XXX.XXX/XXXX-XX para o CNPJ', {position: 'bottom-left', autoClose: 2500, className: 'flash-login', hideProgressBar: true, pauseOnHover: false, theme: "dark"})
            }
            else if (valor.length<6){
                setCnpj(valor)
                setControleCnpj(2)
            }
            else if(valor.length === 6 && controleCnpj < 6) {
                setCnpj(valor + '.')
                setControleCnpj(6)
            }
            else if(valor.length === 7 && valor[valor.length-1] !== '.'){
                setCnpj(cnpj + '.' + valor[valor.length-1])
                setControleCnpj(6)
            }
            else if (valor.length < 10){
                setCnpj(valor)
                setControleCnpj(6)
            }
            else if(valor.length === 10 && controleCnpj < 10) {
                setCnpj(valor + '/')
                setControleCnpj(10)
            }
            else if(valor.length === 11 && valor[valor.length-1] !== '/'){
                setCnpj(cnpj + '/' + valor[valor.length-1])
                setControleCnpj(10)
            }
            else if (valor.length < 15){
                setCnpj(valor)
                setControleCnpj(10)
            }
            else if(valor.length === 15 && controleCnpj < 15) {
                setCnpj(valor + '-')
                setControleCnpj(15)
            }
            else if(valor.length === 16 && valor[valor.length-1] !== '-'){
                setCnpj(cnpj + '-' + valor[valor.length-1])
                setControleCnpj(15)
            }
            else {
                setCnpj(valor)
            }
        }
    }

    function trataCep(evento:any){
        let valor = evento.target.value
        if(isNaN(valor[valor.length-1]) && valor[valor.length-1] !=='-' && valor[valor.length-1] !== undefined){
            setCep(cep)
        }
        else{
            if(valor.length === 5 && cep[cep.length-1] !=='-') {setCep(valor + '-')}
            else if (valor.length === 6 && valor[valor.length-1] !== '-'){
                
                setCep(cep + '-' + valor[valor.length-1])
            }
            else{setCep(valor)}
        }
    }

    function trataNumero(evento:any){
        let valor = evento.target.value
        if (isNaN(valor[valor.length-1])){
            setNumero('')
        }
        else{
            setNumero(valor)
        }
    }

    function carretFim(ref:any){
        ref.current.setSelectionRange(-1, -1)
    }

    function impedeSeta(evento:any){
        if(evento.keyCode === 37 || evento.keyCode === 39){
            evento.preventDefault();
        }
    }

    //================== APAGA TUDO ==================

    function apagaTudo(){
        setRazaoSocial('')
        setNomeFantasia('')
        setCnpj('')
        setCidade('')
        setCep('')
        setEstado('')
        setBairro('')
        setRuaAvenida('')
        setNumero('')
    }

    //================== EDIÇÃO ======================
    async function resgataValores(){
        setEditar(true)
    }

    //============ DESATIVAR FORNECEDOR ==============
    async function deletaFornecedor(){
        await api.post("/deletaFornecedor", {id}).then((reposta) => {navegate('/listaFornecedor')})
    }

    //================== USE EFFECT ==================

    useEffect(()=>{
        async function veLogado(){
            let resultado = await verificaLogado()
            //setLogado(resultado)
            if (resultado.logado && (resultado.funcao !== 'Gerente' && resultado.funcao !== 'Administrador')){
                navegate('/listaPedidos')
            }
            else if(!resultado.logado){
                navegate('/')
            }
        }
        veLogado()
        }, [editar])

        useEffect(()=>{
            if(id){
                resgataValores()
            }
            }, [])

    //================== REENDERIZAÇÃO ==================

    return (
        <>
        <NavBar />
        <div className="divFornecedor">
            <center>
                <h1 className='mainTitle'>Cadastro de Fornecedores</h1>
            </center>
            
            <form>
                <div className="grid-container poscentralized">
                    <div className="box">
                        <table>
                            <thead>
                                <tr>
                                    <th>Razão Social:</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><input className="input_form" maxLength={40} type="text" id="for_razao_social" name="for_razao_social"
                                        required
                                        value={razaoSocial}
                                        onChange={(e) => setRazaoSocial(e.target.value)} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="box">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nome Fantasia:</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><input className="input_form" type="text" id="for_nome_fantasia"
                                        name="for_nome_fantasia" maxLength={40} required
                                        value={nomeFantasia}
                                        onChange={(e) => setNomeFantasia(e.target.value)} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="box">
                        <table>
                            <thead>
                                <tr>
                                    <th>CNPJ:</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><input className="input_form" type="text" placeholder="00.000.000/0000-00"
                                        minLength={18}
                                        maxLength={18}
                                        ref={cnpjRef}
                                        id="for_cnpj"
                                        name="for_cnpj" required
                                        value={cnpj} onChange={trataCnpj}
                                        onClick={() => carretFim(cnpjRef)}
                                        onKeyDown={impedeSeta} />
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
                                    <th>Cidade:</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><input className="input_form" maxLength={40} type="text" id="end_cidade" name="end_cidade" required
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
                                    <th>CEP:</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><input className="input_form" type="text" placeholder="00000-000"
                                        id="end_cep" name="end_cep" minLength={9} maxLength={9} required
                                        value={cep}
                                        ref={cepRef}
                                        onChange={trataCep}
                                        onClick={() => carretFim(cepRef)}
                                        onKeyDown={impedeSeta} /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
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
                </div>
                <div className="grid-container poscentralized">
                    <div className="box">
                        <table>
                            <thead>
                                <tr>
                                    <th>Bairro:</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><input className="input_form" maxLength={40} type="text" id="end_bairro" name="end_bairro" required
                                        value={bairro} onChange={(e) => setBairro(e.target.value)} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="box">
                        <table>
                            <thead>
                                <tr>
                                    <th>Rua/Avenida:</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><input className="input_form" maxLength={40} type="text" id="end_rua_avenida" name="end_rua_avenida"
                                        required
                                        value={ruaAvenida}
                                        onChange={(e => setRuaAvenida(e.target.value))} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
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
                </div>
                <button type='button' className="cancel_button" onClick={() => {navegate('/listaFornecedor')}}>Cancelar</button>
                <button type='button' className="confirm_button" onClick={cadastraFornecedor}>Confirmar</button>
            </form>
        </div>
        </>
        
    );
}

export default CadFornecedor