import { useState, useEffect } from 'react'
import api from '../services/api'
import NavBar from './NavBar'
import { Link, redirect, useNavigate, useParams } from 'react-router-dom'
import verificaLogado from '../funcoes/verificaLogado'
import ListaProdutos from './ListaProdutos'
import { toast } from 'react-toastify'
import lixeira from '../images/lixeira.png'
import { DefaultDeserializer } from 'v8'
import Swal from 'sweetalert2';

interface Regra {
    tipo: string,
    valor: string,
    // obrigatoriedade: boolean
}

export interface Produto {
    prod_descricao: string
}

function CadProduto() {

    const [descricao, setDescricao] = useState('')
    const [unidadeMedida, setUnidadeMedida] = useState('')
    // const [regras, setRegras] = useState<Regra[]>([{ tipo: 'Mínimo de conformidade', valor: '', obrigatoriedade: true },
    // { tipo: 'Avaria', valor: 'Não deve haver', obrigatoriedade: true }])
    const [regras, setRegras] = useState<Regra[]>([{ tipo: 'Avaria', valor: 'Não deve haver' }])
    const [render, setRender] = useState(0)
    const [edicao, setEdicao] = useState(false)
    const { id } = useParams()
    const [produtoUtilizado, setProdutoUtilizado] = useState(false)
    const [produtoDescricao, setProdutoDescricao] = useState<Produto[]>([])
    const [nomeInicial, setNomeInicial] = useState('')
    const [unidadeMedidaInicial, setUnidadeMedidaInicial] = useState('')


    const navigate = useNavigate()

    // ======================= Adicionar Regras ==========================

    function addRegra() {
        let regra = regras
        // regra.push({ tipo: '', valor: '', obrigatoriedade: false })
        regra.push({ tipo: '', valor: '' })
        setRegras(regra)
        console.log(regras)
        setRender(render + 1)

        return (
            <>
                {regras.map((valor, id) =>
                    <>
                        {id > 1 &&
                            <div className='avaria'>

                                <button onClick={() => deleteRegra(id)}>
                                    <img src=".\images\lixeira.png" alt="Lixeira" />
                                </button>

                                <label>Tipo:</label>
                                <select className='input_form' value={regras[id].tipo} onChange={(e) => { mudaTipo(e, id) }}>
                                    <option value=""></option>
                                    <option value="Umidade" selected>Umidade</option>
                                    <option value="Pureza">Pureza</option>
                                    <option value="Personalizada">Personalizada</option>
                                </select>

                                <label>Regra:</label>
                                {regras[id].tipo === "Umidade" &&
                                    <input type='text' className='input_form'
                                        value={regras[id].valor}
                                        onChange={(e) => { mudaParametro(e, id) }}
                                        onBlur={(e) => { blurUmidade(e, id) }}
                                        onSelect={(e) => { selectUmidade(e, id) }} />
                                }
                                {regras[id].tipo === "Pureza" &&
                                    <input type='text' className='input_form'
                                        value={regras[id].valor}
                                        onChange={(e) => { mudaParametro(e, id) }}
                                        onBlur={(e) => { blurPureza(e, id) }}
                                        onSelect={(e) => { selectPureza(e, id) }} />
                                }
                                {regras[id].tipo === "Personalizada" &&
                                    <input type='text' className='input_form'
                                        value={regras[id].valor}
                                        onChange={(e) => { mudaParametro(e, id) }} />
                                }
                                {regras[id].tipo === '' &&
                                    <input type='text' className='input_form'
                                        value={regras[id].valor}
                                        onChange={(e) => { mudaParametro(e, id) }} />
                                }


                                <label>Obrigatoriedade:</label>
                                {/* <input type="checkbox" checked={regras[id].obrigatoriedade} onChange={(e) => { mudaObrigatoriedade(e, id) }} /> */}

                            </div>
                        }
                    </>
                )}
            </>
        )
    };


    // ======================== Deletar Regras ===========================

    function deleteRegra(id: number) {
        const updatedRegras = [...regras];
        updatedRegras.splice(id, 1);
        setRegras(updatedRegras);
    }

    //======================== Funções de mudança ========================   

    function mudaTipo(e: any, id: number) {
        let regra = regras
        regra[id].tipo = e.target.value
        regra[id].valor = ''
        setRegras(regra)
        setRender(render + 1)
        console.log(regras[id].tipo)
    }

    function mudaParametro(e: any, id: number) {
        let regra = regras

        if (regra[id].tipo !== "Personalizada" && regra[id].tipo !== "" && !isNaN(e.target.value)) {
            regra[id].valor = e.target.value
        }
        else if (regra[id].tipo === "Personalizada") {
            regra[id].valor = e.target.value
        }
        else if (regra[id].tipo === "") {
            toast.error('Escolha o tipo primeiro', {
                position: 'bottom-left',
                autoClose: 2500, className: 'flash', hideProgressBar: true, pauseOnHover: false, theme: "dark"
            })
        }
        else {
            toast.error('Insira apenas números', {
                position: 'bottom-left',
                autoClose: 2500, className: 'flash', hideProgressBar: true, pauseOnHover: false, theme: "dark"
            })
        }
        setRegras(regra)
        setRender(render + 1)
        console.log(regras[id].valor)
    }

    // function mudaObrigatoriedade(e: any, id: number) {
    //     let regra = regras
    //     console.log(e.target.checked)
    //     if (e.target.checked === true) {
    //         regra[id].obrigatoriedade = true
    //     }
    //     else {
    //         regra[id].obrigatoriedade = false
    //     }
    //     setRegras(regra)
    //     setRender(render + 1)
    //     console.log(regras[id].obrigatoriedade)
    // }
    //=============== Edição do produto ===================
    async function resgataValores() {
        await api.post('/resgataValoresProduto', { id: id }).then((resposta) => {
            //console.log(resposta.data)
            let dado = resposta.data.produto
            let existeProduto = resposta.data.produtoUtilizado
            let produtos = resposta.data.produtos
            setDescricao(dado.descricao)
            setUnidadeMedida(dado.unidadeMedida)
            setRegras(dado.regras)
            setEdicao(true)
            setProdutoUtilizado(existeProduto)
            setProdutoDescricao(produtos)
            setNomeInicial(dado.descricao)
            setUnidadeMedidaInicial(dado.unidadeMedida)
        })
    }

    async function edicaoProduto() {
        let controle = true
        if (unidadeMedida === '' || descricao === '') {
            toast.error('Preencha todos os campos', {
                position: 'bottom-left',
                autoClose: 2500, className: 'flash', hideProgressBar: true, pauseOnHover: false, theme: "dark"
            })
        }
        if (descricao !== nomeInicial && produtoDescricao.some(produto => produto.prod_descricao === descricao)) {
            toast.error('Produto existente', {
                position: 'bottom-left',
                autoClose: 2500, className: 'flash', hideProgressBar: true, pauseOnHover: false, theme: "dark"
            })
        }
        else {
            if (descricao === nomeInicial || (descricao !== nomeInicial && produtoDescricao.some(produto => produto.prod_descricao !== descricao))) {
                //Confere se todas as regras estão preenchidas e há no máximo 1 regra de umidade e 1 de pureza
                let contadorTipo = { Pureza: 0, Umidade: 0 }
                regras.forEach((regra: Regra) => {
                    console.log(regra)
                    if (regra.tipo === '' || regra.valor === "") {
                        controle = false

                    }
                    //Contador de regras de umidade e pureza:
                    else {
                        if (regra.tipo === 'Pureza') {
                            contadorTipo.Pureza += 1
                        }
                        else if (regra.tipo === 'Umidade') {
                            contadorTipo.Umidade += 1
                        }
                    }
                })

                if (controle) {
                    if (contadorTipo.Umidade > 1) {
                        toast.error('Não pode haver mais de uma regra de Umidade', {
                            position: 'bottom-left',
                            autoClose: 2500, className: 'flash', hideProgressBar: true, pauseOnHover: false, theme: "dark"
                        })
                    }
                    else if (contadorTipo.Pureza > 1) {
                        toast.error('Não pode haver mais de uma regra de Pureza', {
                            position: 'bottom-left',
                            autoClose: 2500, className: 'flash', hideProgressBar: true, pauseOnHover: false, theme: "dark"
                        })
                    }
                    else {
                        await api.post('/updateProduto', { id: id, descricao: descricao, unidadeMedida: unidadeMedidaInicial, regras: regras }).then((resposta) => {
                            navigate('/listaProdutos')
                        })
                    }
                }
                else {
                    toast.error('Preencha todas as regras adicionadas', {
                        position: 'bottom-left',
                        autoClose: 2500, className: 'flash', hideProgressBar: true, pauseOnHover: false, theme: "dark"
                    })

                }

            }
        }
    }

    function redirecionarProduto() {
        navigate('/listaProdutos')
    }

    async function getDescricaoProdutos() {
        await api.get('/getDescricaoProdutos').then((resposta) => {
            //console.log(resposta.data)
            setProdutoDescricao(resposta.data)

        })
    }


    //============ DELETAR PRODUTO ==============
    async function confirmarDelete() {
        if (produtoUtilizado) {
            Swal.fire({
                title: 'Não foi possível excluir o produto',
                text: 'Produto utilizado em algum pedido',
                icon: 'warning',
                showConfirmButton: false,
                showCancelButton: true,
                cancelButtonColor: '#3E813B',
                cancelButtonText: 'Ok'
            })
        } else {
            Swal.fire({
                title: 'Excluir produto?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#C0C0C0',
                cancelButtonColor: '#3E813B',
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Confirmar',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await deletaProduto()
                }
            })
        }
    }

    async function deletaProduto() {
        navigate('/listaProdutos')
        await api.post("/deletaProduto", { id })/* .then((reposta) => {navegate('/listaFornecedor')}) */
    }

    //======================== Mascaras ========================

    //OnBlur

    function blurConformidade(evento: any, id: number) {
        let valor = evento.target.value
        if (valor.slice(-1) !== 's' && valor.length !== 0) {
            valor = valor + ' regras'
            let regra = regras
            regra[id].valor = valor
            if (!evento.target.selected) {
                setRender(render + 1)
            }
        }
    }

    function blurPureza(evento: any, id: number) {
        let valor = evento.target.value
        if (valor[0] !== '>' && valor.slice(-1) !== '%' && valor.length !== 0) {
            valor = '>' + valor + '%'
            let regra = regras
            regra[id].valor = valor
            console.log(regra)
            setRegras(regra)
            if (!evento.target.selected) {
                setRender(render + 1)
            }
        }


    }
    function blurUmidade(evento: any, id: number) {
        let valor = evento.target.value
        if (valor[0] !== '>' && valor.slice(-1) !== '%' && valor.length !== 0) {
            valor = '<' + valor + '%'
            let regra = regras
            regra[id].valor = valor
            console.log(regra)
            setRegras(regra)
            if (!evento.target.selected) {
                setRender(render + 1)
            }
        }
    }

    //OnSelect

    function selectConformidade(evento: any, id: number) {
        let valor = evento.target.value
        console.log(valor.slice(-7, -1))
        if (valor.slice(-7, -1) === ' regra' && valor.length > 0) {
            valor = valor.slice(0, -7)
            let regra = regras
            regra[id].valor = valor
            setRegras(regra)
            setRender(render + 1)
        }
    }

    function selectPureza(evento: any, id: number) {
        let valor = evento.target.value
        if (valor[0] === '>' && valor.slice(-1) === '%') {
            valor = valor.slice(1, -1)
            console.log(valor)
            let regra = regras
            regra[id].valor = valor
            console.log(regra)
            setRegras(regra)
            setRender(render + 1)
        }
    }

    function selectUmidade(evento: any, id: number) {
        let valor = evento.target.value
        if (valor[0] === '<' && valor.slice(-1) === '%') {
            valor = valor.slice(1, -1)
            console.log(valor)
            let regra = regras
            regra[id].valor = valor
            console.log(regra)
            setRegras(regra)
            setRender(render + 1)
        }
    }



    //======================== Use Effect ========================

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
    }, [edicao, render, regras])
    useEffect(() => {
        if (id) {
            resgataValores()
            getDescricaoProdutos()
        }
    }, [])

    //======================== Submit ========================

    async function cadastroProduto(evento: any) {
        getDescricaoProdutos()

        let controle = true
        if (unidadeMedida === '' || descricao === '') {
            toast.error('Preencha todos os campos', {
                position: 'bottom-left',
                autoClose: 2500, className: 'flash', hideProgressBar: true, pauseOnHover: false, theme: "dark"
            })
        }
        console.log(produtoDescricao.some(produto => produto.prod_descricao === descricao))
        if (produtoDescricao.some(produto => produto.prod_descricao === descricao)) {
            toast.error('Produto existente', {
                position: 'bottom-left',
                autoClose: 2500, className: 'flash', hideProgressBar: true, pauseOnHover: false, theme: "dark"
            })
            return;
        }
        else {
            console.log(produtoDescricao.some(produto => produto.prod_descricao !== descricao))
            if (descricao !== '' && (produtoDescricao.some(produto => produto.prod_descricao !== descricao) || produtoDescricao.length === 0)) {
                //Confere se todas as regras estão preenchidas e há no máximo 1 regra de umidade e 1 de pureza
                let contadorTipo = { Pureza: 0, Umidade: 0 }
                regras.forEach((regra: Regra) => {
                    console.log(regra)
                    if (regra.tipo === '' || regra.valor === "") {
                        controle = false

                    }
                    //Contador de regras de umidade e pureza:
                    else {
                        if (regra.tipo === 'Pureza') {
                            contadorTipo.Pureza += 1
                        }
                        else if (regra.tipo === 'Umidade') {
                            contadorTipo.Umidade += 1
                        }
                    }
                })

                if (controle) {
                    if (contadorTipo.Umidade > 1) {
                        toast.error('Não pode haver mais de uma regra de Umidade', {
                            position: 'bottom-left',
                            autoClose: 2500, className: 'flash', hideProgressBar: true, pauseOnHover: false, theme: "dark"
                        })
                    }
                    else if (contadorTipo.Pureza > 1) {
                        toast.error('Não pode haver mais de uma regra de Pureza', {
                            position: 'bottom-left',
                            autoClose: 2500, className: 'flash', hideProgressBar: true, pauseOnHover: false, theme: "dark"
                        })
                    }
                    else {
                        const post = { descricao, unidadeMedida, regras }

                        await api.post('/cadastroProduto', { post }).then((resposta) => { navigate('/listaProdutos') })
                    }

                }
                else {
                    toast.error('Preencha todas as regras adicionadas', {
                        position: 'bottom-left',
                        autoClose: 2500, className: 'flash', hideProgressBar: true, pauseOnHover: false, theme: "dark"
                    })

                }
            }
        }
    }

    return (
        <>
            <NavBar />
            <div className='divFornecedor'>
                <div className={`${edicao === true ? 'flexMainFornecedor' : ''}`}>
                    {edicao &&
                        <>
                            <h1 className='mainTitle'>Edição de Produtos</h1>
                            <img src={lixeira} alt='Excluir produto' id='clicavel' className='lixoFornecedor' onClick={() => confirmarDelete()} />
                        </>
                    }
                    {!edicao && <h1 className='mainTitle'>Cadastro de Produtos</h1>}

                </div>

                <form className='responsividade'>
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

                        <div className="box">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Unidade de medida:</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{edicao && <select className='input_form' name="unidadeMedida" id="unidadeMedida"
                                            disabled
                                            value={unidadeMedidaInicial}
                                            onChange={(e) => { setUnidadeMedida(e.target.value) }}>
                                            <option value=""></option>
                                            <option value="kg">Quilogramas (kg)</option>
                                            <option value="t">Toneladas (t)</option>
                                        </select>}
                                            {!edicao && <select className='input_form' name="unidadeMedida" id="unidadeMedida"
                                                required
                                                value={unidadeMedida}
                                                onChange={(e) => { setUnidadeMedida(e.target.value) }}>
                                                <option value=""></option>
                                                <option value="kg">Quilogramas (kg)</option>
                                                <option value="t">Toneladas (t)</option>
                                            </select>}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className='box3 shadow'>
                        <h1 className='mainTitle'>Regras de Recebimento</h1>
                        <br /><br />

                        {regras.map((valor, id) =>
                            <>
                                {/* {id === 0 &&
                                    <>
                                    <div className='minimo'>
                                        
                                        <div className='flexCheckbox'>
                                            <label className='tipo-regra'>Tipo de Regra:</label>
                                            <select className='input_form' name="unidadeMedida" id="unidadeMedida" disabled>
                                                <option value=""></option>
                                                <option value="minimo" selected>Minimo de Conformidade</option>
                                            </select>
                                        </div>
                                        
                                        <div className='flexCheckbox'>
                                            <label className='limitacao'>Limitação:</label>
                                            <input className='input_formLimit' type="text" value={regras[id].valor}
                                                onChange={(e) => { mudaParametro(e, id) } }
                                                onBlur={(e) => { blurConformidade(e, id) } }
                                                onSelect={(e) => { selectConformidade(e, id) } } />
                                        </div>
                                        
                                        <div className='flexCheckbox'>
                                            <label className='obrigacao'>Obrigatória:</label>
                                            <input type="checkbox" className='checkboxzin' checked={regras[id].obrigatoriedade} disabled />
                                        </div>
                                        
                                        <br /><br />
                                    </div></>
                                } */}
                                {id === 0 &&
                                    <div className='minimo'>
                                        <div className='flexCheckbox'>
                                            <label className='tipo-regra'>Tipo de Regra:</label>
                                            <select className='input_form' name="unidadeMedida" id="unidadeMedida" disabled>
                                                <option value=""></option>
                                                <option value="avaria" selected>Avarias</option>
                                            </select>
                                        </div>
                                        <div className='flexCheckbox'>
                                            <label className='limitacao'>Regra:</label>
                                            <input className='input_formLimit' type="text" value={regras[id].valor} readOnly />
                                        </div>
                                        {/* <div className='flexCheckbox'>
                                            <label className='obrigacao'>Obrigatória:</label>
                                            <input type="checkbox" className='checkboxzin' checked={regras[id].obrigatoriedade} disabled />
                                        </div> */}

                                        <br /><br />
                                    </div>
                                }
                                {id > 0 &&
                                    <div className='minimo'>

                                        <img src={lixeira} alt="Lixo" className='lixeira' onClick={() => deleteRegra(id)} />


                                        <div className='flexCheckbox'>
                                            <label className='tipo-regra'>Tipo de Regra:</label>
                                            <select className='input_form' value={regras[id].tipo} onChange={(e) => { mudaTipo(e, id) }}>
                                                <option value=""></option>
                                                <option value="Umidade" selected>Umidade</option>
                                                <option value="Pureza">Pureza</option>
                                                <option value="Personalizada">Personalizada</option>
                                            </select>
                                        </div>

                                        <div className='flexCheckbox'>
                                            <label className='limitacao'>Regra:</label>
                                            {regras[id].tipo === "Umidade" &&
                                                <input className='input_formLimit' type='text'
                                                    value={regras[id].valor}
                                                    onChange={(e) => { mudaParametro(e, id) }}
                                                    onBlur={(e) => { blurUmidade(e, id) }}
                                                    onSelect={(e) => { selectUmidade(e, id) }} placeholder='Insira um número' />
                                            }
                                            {regras[id].tipo === "Pureza" &&
                                                <input className='input_formLimit' type='text'
                                                    value={regras[id].valor}
                                                    onChange={(e) => { mudaParametro(e, id) }}
                                                    onBlur={(e) => { blurPureza(e, id) }}
                                                    onSelect={(e) => { selectPureza(e, id) }} placeholder='Insira um número' />
                                            }
                                            {regras[id].tipo === "Personalizada" &&
                                                <input className='input_formLimit' type='text'
                                                    value={regras[id].valor}
                                                    onChange={(e) => { mudaParametro(e, id) }} placeholder='Digite a regra' />
                                            }
                                            {regras[id].tipo === '' &&
                                                <input className='input_formLimit' type='text'
                                                    value={regras[id].valor}
                                                    onChange={(e) => { mudaParametro(e, id) }} placeholder='Escolha um tipo antes' />
                                            }
                                        </div>


                                        {/* <div className='flexCheckbox'>
                                            <label className='obrigacao'>Obrigatória:</label>
                                            <input type="checkbox" className='checkboxzin' checked={regras[id].obrigatoriedade} onChange={(e) => { mudaObrigatoriedade(e, id) }} />
                                        </div> */}



                                        <br /><br />
                                    </div>
                                }
                            </>
                        )}
                        <br />
                        <button type='button' className='addRegras' onClick={addRegra}>Adicionar mais uma</button>

                    </div>
                    <div className="grid-container poscentralized">

                        <div className='button_margin'>
                            <button className="cancel_button" onClick={redirecionarProduto}>Cancelar</button>

                        </div>
                        {!edicao &&
                            <button className='confirm_button' type='button' onClick={cadastroProduto}>Cadastrar</button>
                        }
                        {edicao &&
                            <button className='confirm_button' type='button' onClick={edicaoProduto}>Editar</button>
                        }
                    </div>
                </form>
                <br />
            </div>
        </>
    )
}

export default CadProduto