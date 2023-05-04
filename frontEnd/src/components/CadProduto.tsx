import { useState, useEffect } from 'react'
import api from '../services/api'
import NavBar from './NavBar'
import { Link, redirect, useNavigate } from 'react-router-dom'
import verificaLogado from '../funcoes/verificaLogado'

interface Regra{
    tipo:string,
    valor:string,
    obrigatoriedade:boolean
}

function CadProduto() {

    const [descricao, setDescricao] = useState('')
    const [unidadeMedida, setUnidadeMedida] = useState('')
    const [regras, setRegras] = useState<Regra[]>([{tipo:'Mínimo de conformidade', valor:'', obrigatoriedade:true}, {tipo:'Avaria', valor:'Não deve haver', obrigatoriedade:true}])
    const [render, setRender] = useState(0)

    const navigate = useNavigate()


    function mudaTipo(e:any, id:number){
        let regra = regras
        regra[id].tipo = e.target.value
        setRegras(regra)
        setRender(render+1)
        console.log(regras[id].tipo)
    }

    function mudaParametro(e:any, id:number){
        let regra = regras
        regra[id].valor = e.target.value
        setRegras(regra)
        setRender(render+1)
        console.log(regras[id].valor)
    }

    function mudaObrigatoriedade(e:any, id:number){
        let regra = regras
        console.log(e.target.checked)
        if(e.target.checked === true){
            regra[id].obrigatoriedade = true
        }
        else{
            regra[id].obrigatoriedade = false
        }
        setRegras(regra)
        setRender(render+1)
        console.log(regras[id].obrigatoriedade)
    }


    useEffect(() => {
        async function veLogado() {
            let resultado = await verificaLogado()
            //setLogado(resultado)
            if (resultado.logado && (resultado.funcao !== 'Gerente' && resultado.funcao !== 'Administrador')) {
                navigate('/listaPedidos')
            }
            else if (!resultado.logado) {
                navigate('/')
            }
        }
        veLogado()
    }, [render])

    async function cadastroProduto(evento: any) {
        evento.preventDefault()
        //dados de teste/modelo dos dados de inserção de regra de recebimento
        /* const regrasRecebimento = [{tipo: 'umidade', valor:'<10%', obrigatoriedade:'sim'}, 
        {tipo: 'avarias', valor:'não deve haver', obrigatoriedade:'não'}, 
        {tipo: 'pureza', valor:'>=90%', obrigatoriedade:'sim'}] */ 
        const post = { descricao, unidadeMedida}
        navigate('/listaProdutos')
        await api.post('/cadastroProduto', { post })
    }

    return (
        <>
            <NavBar />
            <div className='divFornecedor'>
                <form>
                    <h1 className='mainTitle'>Cadastro de Produtos</h1>

                    <div className="grid-container poscentralized">
                        <div className="box">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Descrição do produto:</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <input type="text" className='input_form' id='descricao' name='descricao'
                                                required
                                                value={descricao}
                                                onChange={(e) => setDescricao(e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="box2">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Unidade de medida:</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <select className='input_form' name="unidadeMedida" id="unidadeMedida"
                                                required
                                                value={unidadeMedida}
                                                onChange={(e) => { setUnidadeMedida(e.target.value) }}>
                                                <option value=""></option>
                                                <option value="kg">Quilogramas (kg)</option>
                                                <option value="t">Toneladas (t)</option>
                                            </select>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className='box3'>
                        <h1 className='mainTitle'>Regras de Recebimento</h1>
                        <br /><br />
            
                        {regras.map((valor, id) =>
                            <>
                            {id === 0 && 
                                <div className='minimo'>
                                    <label>Tipo de Regra:</label>
                                    <select className='input_form' name="unidadeMedida" id="unidadeMedida" disabled>
                                        <option value=""></option>
                                        <option value="minimo" selected>Minimo de <br /> Conformidade</option>
                                    </select>

                                    <label>Limitação:</label>
                                    <span>2 regras</span>
                                    <label>Obrigatória:</label>
                                    <input type="checkbox" className='checkbox' />
                                    <br /><br />
                                </div> 
                            }
                            {id === 1 && 
                                <div className='avaria'>
                                    <label>Tipo de Regra:</label>
                                    <select className='input_form' name="unidadeMedida" id="unidadeMedida" disabled>
                                        <option value=""></option>
                                        <option value="avaria" selected>Avarias</option>
                                    </select>
                                    <label>Limitação:</label>
                                    <span>Não deve Haver</span>
                                    <label>Obrigatória:</label>
                                    <input type="checkbox" className='checkbox' />
                                    <br /><br />
                                </div>
                            }
                            {id > 1 &&
                                <div className='avaria'>
                                    <label>Tipo:</label>
                                    <select className='input_form' value={regras[id].tipo} onChange={(e) => {mudaTipo(e, id)}}>
                                        <option value=""></option>
                                        <option value="Umidade" selected>Umidade</option>
                                        <option value="Pureza">Pureza</option>
                                        <option value="Personalizada">Personalizada</option>
                                    </select>

                                    <label>Regra:</label>
                                    <input type='text' className='input_form' value={regras[id].valor} onChange={(e) => {mudaParametro(e, id)}}/>

                                    <label>Obrigatoriedade:</label>
                                    <input type="checkbox" checked={regras[id].obrigatoriedade} onChange={(e) => {mudaObrigatoriedade(e, id)}}/>
                                </div>
                            }
                            </>  
                        )}
        
                        <a href="">Adicionar mais regras</a>
                    </div>
                    <div className="grid-container poscentralized">
                        <input className="confirm_button" type="submit" value="Confirmar" />
                        <div className='button_margin'><button className="cancel_button">
                            <Link to={"/listaProdutos"}>Cancelar</Link>
                        </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default CadProduto