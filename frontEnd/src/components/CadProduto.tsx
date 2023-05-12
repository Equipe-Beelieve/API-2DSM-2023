import { useState, useEffect } from 'react'
import api from '../services/api'
import NavBar from './NavBar'
import { Link, redirect, useNavigate } from 'react-router-dom'
import verificaLogado from '../funcoes/verificaLogado'
import ListaProdutos from './ListaProdutos'
import { toast } from 'react-toastify'

interface Regra {
    tipo: string,
    valor: string,
    obrigatoriedade: boolean
}

function CadProduto() {

    const [descricao, setDescricao] = useState('')
    const [unidadeMedida, setUnidadeMedida] = useState('')
    const [regras, setRegras] = useState<Regra[]>([{ tipo: 'Mínimo de conformidade', valor: '', obrigatoriedade: true },
    { tipo: 'Avaria', valor: 'Não deve haver', obrigatoriedade: true }])

    const [render, setRender] = useState(0)


    const navigate = useNavigate()

    // ======================= Adicionar Regras ==========================

    function addRegra() {
        let regra = regras
        regra.push({ tipo: '', valor: '', obrigatoriedade: false })
        setRegras(regra)
        console.log(regras)
        setRender(render + 1)

        return (
            <>
                {regras.map((valor, id) =>
                    <>
                        {id > 1 &&
                            <div className='avaria'>

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
                                <input type="checkbox" checked={regras[id].obrigatoriedade} onChange={(e) => { mudaObrigatoriedade(e, id) }} />

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

    function mudaObrigatoriedade(e: any, id: number) {
        let regra = regras
        console.log(e.target.checked)
        if (e.target.checked === true) {
            regra[id].obrigatoriedade = true
        }
        else {
            regra[id].obrigatoriedade = false
        }
        setRegras(regra)
        setRender(render + 1)
        console.log(regras[id].obrigatoriedade)
    }

    function redirecionarProduto() {
        navigate('/listaProdutos')
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
    }, [render, regras])

    //======================== Submit ========================

    async function cadastroProduto(evento: any) {
        let controle = true
        if (unidadeMedida === '' || descricao === '') {
            toast.error('Preencha todos os campos', {
                position: 'bottom-left',
                autoClose: 2500, className: 'flash', hideProgressBar: true, pauseOnHover: false, theme: "dark"
            })
        }
        else {
            //Confere se todas as regras estão preenchidas e há no máximo 1 regra de umidade e 1 de pureza
            let contadorTipo = { Pureza: 0, Umidade: 0 }
            regras.forEach((regra: Regra) => {
                console.log(regra)
                if (regra.tipo === '' || regra.valor === "" || contadorTipo.Pureza > 1 || contadorTipo.Umidade > 1) {
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
                if(contadorTipo.Umidade > 1){
                    toast.error('Não pode haver mais de uma regra de Umidade', {
                        position: 'bottom-left',
                        autoClose: 2500, className: 'flash', hideProgressBar: true, pauseOnHover: false, theme: "dark"
                    })
                }
                else if(contadorTipo.Pureza > 1){
                    toast.error('Não pode haver mais de uma regra de Pureza', {
                        position: 'bottom-left',
                        autoClose: 2500, className: 'flash', hideProgressBar: true, pauseOnHover: false, theme: "dark"
                    })
                }
                else{
                    const post = { descricao, unidadeMedida, regras }
                    navigate('/listaProdutos')
                    await api.post('/cadastroProduto', { post })
                }
                
            }
            else{
                toast.error('Preencha todas as regras adicionadas', {
                    position: 'bottom-left',
                    autoClose: 2500, className: 'flash', hideProgressBar: true, pauseOnHover: false, theme: "dark"
                })

            }
        }




        //dados de teste/modelo dos dados de inserção de regra de recebimento
        /* const regrasRecebimento = [{tipo: 'umidade', valor:'<10%', obrigatoriedade:'sim'}, 
        {tipo: 'avarias', valor:'não deve haver', obrigatoriedade:'não'}, 
        {tipo: 'pureza', valor:'>=90%', obrigatoriedade:'sim'}] */


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

                        <div className="box">
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
                                        <label className='tipo-regra'>Tipo de Regra:</label>
                                        <select className='input_form' name="unidadeMedida" id="unidadeMedida" disabled>
                                            <option value=""></option>
                                            <option value="minimo" selected>Minimo de Conformidade</option>
                                        </select>

                                        <label className='limitacao'>Limitação:</label>
                                        <input type="text" value={regras[id].valor}
                                            onChange={(e) => { mudaParametro(e, id) }}
                                            onBlur={(e) => { blurConformidade(e, id) }}
                                            onSelect={(e) => { selectConformidade(e, id) }} />
                                        <label className='obrigacao'>Obrigatória:</label>
                                        <input type="checkbox" className='checkbox' checked={regras[id].obrigatoriedade} disabled />
                                        <br /><br />
                                    </div>
                                }
                                {id === 1 &&
                                    <div className='avaria'>
                                        <label className='tipo-regra'>Tipo de Regra:</label>
                                        <select className='input_form' name="unidadeMedida" id="unidadeMedida" disabled>
                                            <option value=""></option>
                                            <option value="avaria" selected>Avarias</option>
                                        </select>
                                        <label className='limitacao'>Limitação:</label>
                                        <input type="text" value={regras[id].valor} readOnly />
                                        <label className='obrigacao'>Obrigatória:</label>
                                        <input type="checkbox" className='checkbox' checked={regras[id].obrigatoriedade} disabled />
                                        <br /><br />
                                    </div>
                                }
                                {id > 1 &&
                                    <div className='personalizada'>

                                        <button onClick={() => deleteRegra(id)}>Delete</button>

                                        <label className='tipo-regra'>Tipo de Regra:</label>
                                        <select className='input_form' value={regras[id].tipo} onChange={(e) => { mudaTipo(e, id) }}>
                                            <option value=""></option>
                                            <option value="Umidade" selected>Umidade</option>
                                            <option value="Pureza">Pureza</option>
                                            <option value="Personalizada">Personalizada</option>
                                        </select>

                                        <label className='limitacao'>Limitacao:</label>
                                        {regras[id].tipo === "Umidade" &&
                                            <input type='text'
                                                value={regras[id].valor}
                                                onChange={(e) => { mudaParametro(e, id) }}
                                                onBlur={(e) => { blurUmidade(e, id) }}
                                                onSelect={(e) => { selectUmidade(e, id) }} />
                                        }
                                        {regras[id].tipo === "Pureza" &&
                                            <input type='text'
                                                value={regras[id].valor}
                                                onChange={(e) => { mudaParametro(e, id) }}
                                                onBlur={(e) => { blurPureza(e, id) }}
                                                onSelect={(e) => { selectPureza(e, id) }} />
                                        }
                                        {regras[id].tipo === "Personalizada" &&
                                            <input type='text'
                                                value={regras[id].valor}
                                                onChange={(e) => { mudaParametro(e, id) }} />
                                        }
                                        {regras[id].tipo === '' &&
                                            <input type='text'
                                                value={regras[id].valor}
                                                onChange={(e) => { mudaParametro(e, id) }} />
                                        }


                                        <label className='obrigacao'>Obrigatória:</label>
                                        <input type="checkbox" className='checkbox' checked={regras[id].obrigatoriedade} onChange={(e) => { mudaObrigatoriedade(e, id) }} />
                                        <br /><br />
                                    </div>
                                }
                            </>
                        )}
                        <br />
                        <button type='button' className='adicionarRegra' onClick={addRegra}>Adicionar mais uma</button>

                    </div>
                    <div className="grid-container poscentralized">

                        <div className='button_margin'>
                            <button className="cancel_button" onClick={redirecionarProduto}>Cancelar</button>

                        </div>
                        <button className='confirm_button' type='button' onClick={cadastroProduto}>Cadastrar</button>
                    </div>
                </form>
                <br />
            </div>
        </>
    )
}

export default CadProduto