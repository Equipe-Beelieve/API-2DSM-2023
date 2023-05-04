import { useState, useEffect } from 'react'
import api from '../services/api'
import NavBar from './NavBar'
import { Link, redirect, useNavigate } from 'react-router-dom'
import verificaLogado from '../funcoes/verificaLogado'

function CadProduto() {

    const [descricao, setDescricao] = useState('')
    const [unidadeMedida, setUnidadeMedida] = useState('')


    const navigate = useNavigate()

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
    }, [])

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
                <form onSubmit={cadastroProduto}>
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