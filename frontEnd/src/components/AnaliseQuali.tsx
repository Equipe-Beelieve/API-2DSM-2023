import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import verificaLogado from '../funcoes/verificaLogado';
import NavBar from './NavBar';
import { toast } from 'react-toastify';

interface Regra {
    reg_codigo: number
    reg_tipo: string
    reg_valor: string
    reg_obrigatoriedade: boolean
}

interface Analise {
    id?:number
    tipo?: string
    valor?: string
    avaria?: string
}

interface RevisaoAnalise {
    par_codigo:number
    regra_tipo:string
    regra_valor:string
    regra_avaria:string
}

function AnaliseQuali() {
    const [regras, setRegras] = useState<Regra[]>([])
    const [analises, setAnalises] = useState<Analise[]>([])
    const [laudo, setLaudo] = useState('não')
    const [mudanca, setMudanca] = useState('')
    const { id } = useParams()

    const navigate = useNavigate()

    async function getRegras() {
        try {
            const response = await api.get(`/analiseQuali/${id}`)
            //console.log(response.data)
            const regras = response.data

            regras.sort((a:Regra, b:Regra) => a.reg_tipo.localeCompare(b.reg_tipo))

            const padraoAnalises = regras.map((regra: Regra) => {
                if (regra.reg_tipo === 'Avaria') {
                    return {
                        tipo: regra.reg_tipo,
                        valor: 'false',
                        avaria: ''
                    }
                } else if (regra.reg_tipo === 'Personalizada') {
                    return {
                        tipo: regra.reg_tipo,
                        valor: 'false',
                    }
                } else {
                    return {
                        tipo: regra.reg_tipo,
                        valor: '',
                    }
                }
            })
  
            setAnalises(padraoAnalises)
            setRegras(regras)
        } catch (erro) {
            console.log(erro)
        }
    }

    async function veStatus() {
        await api.post('/confereStatus', { id: id, acessando: 'Análise Qualitativa' }).then((response) => {
            const dados = response.data
            console.log(dados)

            //console.log(dadosAnalises)
            if (response.data === 'Primeira vez') {
                setMudanca('Primeira vez')
            }
            else if (response.data === 'Revisão') {
                setMudanca('Revisão')
            }
            else {
                const laudo = dados.laudo.nf_laudo
                const analisesFeitas = dados.analises
                analisesFeitas.sort((a:RevisaoAnalise, b:RevisaoAnalise) => a.regra_tipo.localeCompare(b.regra_tipo)) 

                const dadosAnalises = analisesFeitas.map((dado:RevisaoAnalise) => {
                    if(dado.regra_tipo === 'Avaria'){
                        return {
                            id: dado.par_codigo,
                            tipo: dado.regra_tipo,
                            valor: dado.regra_valor,
                            avaria: dado.regra_avaria
                        }
                    } else if(dado.regra_tipo === 'Personalizada'){
                        return {
                            id: dado.par_codigo,
                            tipo: dado.regra_tipo,
                            valor: dado.regra_valor
                        }
                    } else {
                        return {
                            id: dado.par_codigo,
                            tipo: dado.regra_tipo,
                            valor: dado.regra_valor
                        }
                    }
                })

                setMudanca('Edição')
                setAnalises(dadosAnalises)
                setLaudo(laudo)
                
            }
        })
    }

    function manipularAvaria(index: number, comentario: string) {
        const analiseAvaria: Analise = {
            avaria: comentario
        }

        const analiseNova = [...analises]
        analiseNova[index].avaria = analiseAvaria.avaria
        setAnalises(analiseNova)
    }

    function manipularCheckboxAvaria(index: number, check: boolean) {
        const analiseAvaria: Analise = {
            valor: check ? 'true' : 'false'
        }

        const analiseNova = [...analises]
        analiseNova[index].valor = analiseAvaria.valor
        setAnalises(analiseNova)

    }

    function manipularRegraPersonalizada(index: number, check: boolean) {
        const analiseRegra: Analise = {
            valor: check ? 'true' : 'false'
        }
        const analiseNova = [...analises]
        analiseNova[index].valor = analiseRegra.valor
        setAnalises(analiseNova)

    }

    function manipularRegra(index: number, valor: string) {
        const analiseRegra = {
            valor: valor
        }

        const analiseNova = [...analises]
        analiseNova[index].valor = analiseRegra.valor
        setAnalises(analiseNova)

    }

    async function  validaAnalises(acao: string) {
        const analisesNumericas = analises.filter((analise) => {
            return analise.tipo !== 'Avaria' && analise.tipo !== 'Personalizada'
        })
        if (acao === 'Continuar') {
            if (analisesNumericas.every((analise) => analise.valor !== '')) {
                await confirmaContinua()
            } else {
                toast.error('Preencha todas as análises.', {
                    position: 'bottom-left', autoClose: 2500,
                    className: 'flash', hideProgressBar: true, pauseOnHover: false, theme: "dark"
                })
            }
        } else if (acao === 'Voltar') {
            if (analisesNumericas.every((analise) => analise.valor !== '')) {
                await editaVolta()
            } else {
                toast.error('Preencha todas as análises.', {
                    position: 'bottom-left', autoClose: 2500,
                    className: 'flash', hideProgressBar: true, pauseOnHover: false, theme: "dark"
                })
            }
        }
    }

    async function editaVolta(){
        const post = {id, analises, laudo}
        //navigate(`/listaPedidos`)
        await api.post('/updateQualitativa', { post })
    }

    async function confirmaContinua() {
        const post = { id, analises, laudo }
         //substituir listaPedidos pela rota do relatório final, quando pronta
        await api.post('/postQualitativa', { post }).then((resposta) => {navigate(`/listaPedidos`)})

    }

    function cancelaVoltaListagem() {
        navigate('/listaPedidos')
    }

    function estado() {
        console.log(analises)
    }
    //================== Botões ==================
    function irQuantitativa() {
        navigate(`/analiseQuant/${id}`)
    }

    function irRegularizacao() {

    }




    useEffect(() => {
        async function veLogado() {
            let resultado = await verificaLogado()
            if (resultado.logado) {
                getRegras().then(() => veStatus())
                
                if (resultado.funcao !== 'Administrador' && resultado.funcao !== 'Gerente') {
                    navigate('/listaPedidos')
                }
            } else {
                navigate('/')
            }
        }
        veLogado()
        
    }, [])


    if (mudanca !== 'Revisão') {
        return (
            <>
                <NavBar />
                <form >
                    <div className="mainContent">
                        <div className="titleRegister">
                            <h1 className="mainTitle">ANÁLISE QUALITATIVA</h1>
                        </div>
                        {mudanca === 'Edição' &&
                            <button className='button-relatorio' type='button' onClick={irRegularizacao}>Relatório Final</button>
                        }

                        <button className='button' type='button' onClick={irQuantitativa}>Análise Quantitativa</button>
                        <div className='laudo'>
                            <input className='tipo-laudo' type="text" value={'Laudo'} readOnly /> <input className='haver' type="text" value={'Deve haver'} readOnly />
                            
                            {laudo === 'sim' &&
                                <input className='checkbox' type="checkbox" checked onChange={(evento) => setLaudo(laudo === 'sim' ? 'não' : 'sim')} />
                            }
                            {laudo === 'não' &&
                                <input className='checkbox' type="checkbox" onChange={(evento) => setLaudo(laudo === 'não' ? 'sim' : 'não')} />
                            }
                            
                        </div>
                        {regras.map((regra, index) => {
                            if (regra.reg_tipo === 'Avaria') {
                                return (
                                    <div className='regra-avaria' key={index}>
                                        <input className='tipo-avaria' type="text" value={regra.reg_tipo} readOnly /> <input className='regra-valor' type="text" value={regra.reg_valor} readOnly />
                                        {analises[index].valor === 'true' &&
                                            <><input className='checkbox' type="checkbox" checked value={analises[index].valor} onChange={(evento) => manipularCheckboxAvaria(index, evento.target.checked)} /><br /></>
                                        }
                                        {analises[index].valor === 'false' &&
                                            <><input className='checkbox' type="checkbox" value={analises[index].valor} onChange={(evento) => manipularCheckboxAvaria(index, evento.target.checked)} /><br /></>
                                        }

                                        <input className='descricao' type="text" placeholder='Descrição da Avaria' value={analises[index].avaria} onChange={(evento) => manipularAvaria(index, evento.target.value)} />
                                    </div>
                                )
                            } else if (regra.reg_tipo === 'Personalizada') {
                                return (
                                    <div className='regra-personalizar' key={index}>
                                        <input className='personalizar' type="text" value={regra.reg_tipo} readOnly /> <input className='regra-valor' type="text" value={regra.reg_valor} readOnly />

                                        {analises[index].valor === 'true' &&
                                            <input className='checkbox' type="checkbox" checked value={analises[index].valor} onChange={(evento) => manipularRegraPersonalizada(index, evento.target.checked)} />
                                        }
                                        {analises[index].valor === 'false' &&
                                            <input className='checkbox' type="checkbox" value={analises[index].valor} onChange={(evento) => manipularRegraPersonalizada(index, evento.target.checked)} />
                                        }
                                        
                                    </div>
                                )

                            } else {
                                return (
                                    <div className='manipular' key={index}>
                                        <input className='tipo-regra' type="text" value={regra.reg_tipo} readOnly /> <input className='limitacao' type="text" value={regra.reg_valor} readOnly />
                                        <input className='manipular-regra' type="text" placeholder='Insira um Número' value={analises[index].valor} onChange={(evento) => manipularRegra(index, evento.target.value)} required />
                                    </div>
                                )
                            }
                        })}

                        {mudanca === 'Primeira vez' &&
                            <div className='mesmalinha'>
                                <button type="button" onClick={cancelaVoltaListagem} className="cancel_button">Cancelar</button>
                                <button type="button" onClick={(evento) => validaAnalises('Continuar')} className="confirm_button">Confirmar</button>
                            </div>
                        }
                        
                        {mudanca === 'Edição' &&
                            <div className='mesmalinha'>
                                <button type="button" onClick={cancelaVoltaListagem} className="cancel_button">Cancelar</button>
                                <button type="button" onClick={(evento) => editaVolta()} className="confirm_button">Editar</button>
                            </div>
                        }

                    </div>
                </form>
                <button onClick={(evento) => estado()}>ANALISES</button>
            </>
        )
    }
    else {
        return (
            <>
                <NavBar />
                <form >
                    <div className="mainContent">
                        <div className="titleRegister">
                            <h1 className="mainTitle">ANÁLISE QUALITATIVA</h1>
                        </div>
                        <button type='button' onClick={irRegularizacao}>Relatório Final</button>
                        <button type='button' onClick={irQuantitativa}>Análise Quantitativa</button>
                        <div>
                            <input type="text" value={'Laudo'} readOnly /> <input type="text" value={'Deve haver'} readOnly />
                            <input type="checkbox" value={laudo} onChange={(evento) => setLaudo(laudo === 'sim' ? 'não' : 'sim')} />
                        </div>
                        {regras.map((regra, index) => {
                            if (regra.reg_tipo === 'Avaria') {
                                return (
                                    <div key={index}>
                                        <input type="text" value={regra.reg_tipo} readOnly /> <input type="text" value={regra.reg_valor} readOnly />
                                        <input type="checkbox" value={analises[index].valor} onChange={(evento) => manipularCheckboxAvaria(index, evento.target.checked)} /> <br />
                                        <input type="text" value={analises[index].valor} onChange={(evento) => manipularAvaria(index, evento.target.value)} />
                                    </div>
                                )
                            } else if (regra.reg_tipo === 'Personalizada') {
                                return (
                                    <div key={index}>
                                        <input type="text" value={regra.reg_tipo} readOnly /> <input type="text" value={regra.reg_valor} readOnly />
                                        <input type="checkbox" value={analises[index].valor} onChange={(evento) => manipularRegraPersonalizada(index, evento.target.checked)} />
                                    </div>
                                )

                            } else {
                                return (
                                    <div key={index}>
                                        <input type="text" value={regra.reg_tipo} readOnly /> <input type="text" value={regra.reg_valor} readOnly />
                                        <input type="text" value={analises[index].valor} onChange={(evento) => manipularRegra(index, evento.target.value)} required />
                                    </div>
                                )
                            }
                        })
                        }
                        <div className='mesmalinha'>
                            <button type="button" onClick={cancelaVoltaListagem} className="cancel_button">Cancelar</button>
                            <button type="button" onClick={(evento) => validaAnalises('Continuar')} className="confirm_button">Confirmar</button>
                        </div>

                    </div>
                </form>
                <button onClick={(evento) => estado()}>ANALISES</button>
            </>
        )
    }

}
export default AnaliseQuali