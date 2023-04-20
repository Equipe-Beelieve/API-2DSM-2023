import { useEffect, useState } from 'react';
import api from '../services/api'
import { Link, useNavigate } from 'react-router-dom';
import verificaLogado from '../funcoes/verificaLogado';
import NavBar from './NavBar';

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

    const [logado, setLogado] = useState(Boolean)
    const navegate = useNavigate()

    
    //================== SUBMIT DE FORMULÁRIO ==================   
    async function cadastraFornecedor(evento:any){
        evento.preventDefault();
        const post = {cnpj, cep, estado, cidade, bairro, numero, ruaAvenida, razaoSocial, nomeFantasia}
        console.log({razaoSocial, nomeFantasia,cnpj, cidade, cep, estado, bairro, ruaAvenida, numero})
        navegate('/listaFornecedor')
        await api.post('/cadastroFornecedor', 
        {post}
        );
    }
    
    //================== MASCARAS DE FORMULÁRIO ==================

    function trataCnpj(evento:any){
        let valor = evento.target.value
        if(isNaN(valor[valor.length-1]) && valor[valor.length-1] !== '.' && valor[valor.length-1] !== '-' && valor[valor.length-1] !== '/' && valor[valor.length-1] !== undefined){
            console.log(valor[valor.length-1])
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
        }, [])

    //================== REENDERIZAÇÃO ==================

    return (
        <>
        <NavBar />
        <div className="divFornecedor">
            <h1>Cadastro de Fornecedores</h1>
            <form onSubmit={cadastraFornecedor}>
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
                                    <td><input className="input_form" type="text" id="for_razao_social" name="for_razao_social"
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
                                        name="for_nome_fantasia" required
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
                                        id="for_cnpj"
                                        name="for_cnpj" required
                                        value={cnpj} onChange={trataCnpj} />
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
                                    <td><input className="input_form" type="text" id="end_bairro" name="end_bairro" required
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
                                    <td><input className="input_form" type="text" id="end_rua_avenida" name="end_rua_avenida"
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
                <input className="confirm_button" type="submit" value="Cadastrar" />
                <button className="cancel_button">
                    <Link to={'/listaFornecedor'}>Cancelar</Link>
                </button>


            </form>
        </div>
        </>
        
    );
}

export default CadFornecedor