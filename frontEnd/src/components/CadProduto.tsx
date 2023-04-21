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
        const post = { descricao, unidadeMedida }
        navigate('/listaProdutos')
        await api.post('/cadastroProduto', { post })
    }

    return (
        <>
            <NavBar />
            <div className='divFornecedor'>
                <form onSubmit={cadastroProduto}>
                    <h1>Cadastro de Produtos</h1>

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
                    <input className="confirm_button" type="submit" value="Confirmar" />
                    <button className="cancel_button">
                        <Link to={"/listaProdutos"}>Cancelar</Link>
                    </button>
                </form>
            </div>
        </>
    )
}

export default CadProduto