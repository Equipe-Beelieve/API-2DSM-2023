import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import verificaLogado from '../funcoes/verificaLogado';
import NavBar from './NavBar';
import { toast } from 'react-toastify';
import teste from '../images/seta-esquerda.png'

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
                        codigo: regra.reg_codigo,
                        tipo: regra.reg_tipo,
                        valor: 'false',
                        avaria: ''
                    }
                } else if (regra.reg_tipo === 'Personalizada') {
                    return {
                        codigo: regra.reg_codigo,
                        tipo: regra.reg_tipo,
                        valor: 'false',
                    }
                } else {
                    return {
                        codigo: regra.reg_codigo,
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
            if (dados.status === 'Primeira vez') {
                setMudanca('Primeira vez')
            }
            else if (dados.status === 'Revisão') {
                setMudanca('Revisão')
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

                setAnalises(dadosAnalises)
                setLaudo(laudo)
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

    function manipularRegra(index: number, valor: any) {
        const analiseRegra = {
            valor: valor
        }

        if(!isNaN(valor)){
            const analiseNova = [...analises]
            analiseNova[index].valor = analiseRegra.valor
            setAnalises(analiseNova)
        } else {
            toast.error('Insira apenas números', {
            position: 'bottom-left',
            autoClose: 2500, className: 'flash', hideProgressBar: true, pauseOnHover: false, theme: "dark"
            })
        }
    }

    function blurRegra(index:number, valor:any){
        if(valor.length > 0) {
            let valorPorcentagem = valor + '%'
            const analiseNova = [...analises]
            analiseNova[index].valor = valorPorcentagem
            setAnalises(analiseNova)
        }
    }

    function focusRegra(index:number, valor:any){
        if(valor.slice(-1) === '%'){
            let valorSemPorcentagem = valor.slice(0, -1)
            const analiseNova = [...analises]
            analiseNova[index].valor = valorSemPorcentagem
            setAnalises(analiseNova)
        }
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
        } else if (acao === 'Editar') {
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
        await api.post('/updateQualitativa', { post }).then((resposta) => {navigate(`/listaPedidos`)})
    }

    async function confirmaContinua() {
        
        const post = { id, analises, laudo }
         //substituir listaPedidos pela rota do relatório final, quando pronta
        await api.post('/postQualitativa', { post }).then((resposta) => {navigate(`/relatorioFinal/${id}`)})

    }

    function cancelaVoltaListagem() {
        navigate('/listaPedidos')
    }

    //================== Botões ==================
    function irQuantitativa() {
        navigate(`/analiseQuant/${id}`)
    }

    function irRegularizacao() {
        navigate(`/relatorioFinal/${id}`)
    }

    useEffect(() => {
        async function veLogado() {
            let resultado = await verificaLogado()
            if (resultado.logado) {
                getRegras().then(() => veStatus())
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
                <form className='responsividadeforms'>
                    <div className="mainContent">
                        <div className="botoesNavegacao">
                            <button className='botaoteste4' type='button' onClick={irQuantitativa}>
                                <img src={teste} alt="" className="testeaEsquerda" />Análise Quantitativa</button>
                            <h1 className="mainTitle">ANÁLISE QUALITATIVA</h1>
                        </div>
                        <p className='info'>Selecione o checkbox de resultado se a regra for cumprida</p>
                        <div className='laudo'>
                            <input className='tipo-laudo' type="text" value={'Laudo'} readOnly />
                            <input className='haver' type="text" value={'Deve haver'} readOnly />
                            <div className='divCheckbox'>
                                <span className='resultadoCheckbox'>Resultado:</span>
                                {laudo === 'sim' &&
                                    <input className='checkbox' type="checkbox" checked onChange={(evento) => setLaudo(laudo === 'sim' ? 'não' : 'sim')} />
                                }
                                {laudo === 'não' &&
                                    <input className='checkbox' type="checkbox" onChange={(evento) => setLaudo(laudo === 'não' ? 'sim' : 'não')} />
                                }
                            </div>
                            
                            
                        </div>
                        {regras.map((regra, index) => {
                            if (regra.reg_tipo === 'Avaria') {
                                return (
                                    <div className='laudo' key={index}>
                                        <input className='tipo-avaria' type="text" value={regra.reg_tipo} readOnly /> 
                                        <input className='regra-valor' type="text" value={regra.reg_valor} readOnly />
                                        <div className='divCheckbox'>
                                            <span className='resultadoCheckbox'>Resultado:</span>
                                            {analises[index].valor === 'true' &&
                                                <><input className='checkbox' type="checkbox" checked value={analises[index].valor} onChange={(evento) => manipularCheckboxAvaria(index, evento.target.checked)} /><br /></>
                                            }
                                            {analises[index].valor === 'false' &&
                                                <><input className='checkbox' type="checkbox" value={analises[index].valor} onChange={(evento) => manipularCheckboxAvaria(index, evento.target.checked)} /><br /></>
                                            }
                                        </div>
                                        

                                        <textarea className='descricao' placeholder='Descrição da Avaria' value={analises[index].avaria} onChange={(evento) => manipularAvaria(index, evento.target.value)} />
                                    </div>
                                )
                            } else if (regra.reg_tipo === 'Personalizada') {
                                return (
                                    <div className='laudo' key={index}>
                                        <input className='personalizar' type="text" value={regra.reg_tipo} readOnly /> <input className='regra-valor' type="text" value={regra.reg_valor} readOnly />

                                        <div className='divCheckbox'>
                                            <span className='resultadoCheckbox'>Resultado:</span>
                                            {analises[index].valor === 'true' &&
                                                <><input className='checkbox' type="checkbox" checked value={analises[index].valor} onChange={(evento) => manipularCheckboxAvaria(index, evento.target.checked)} /><br /></>
                                            }
                                            {analises[index].valor === 'false' &&
                                                <><input className='checkbox' type="checkbox" value={analises[index].valor} onChange={(evento) => manipularCheckboxAvaria(index, evento.target.checked)} /><br /></>
                                            }
                                        </div>
                                        
                                    </div>
                                )

                            } else {
                                return (
                                    <div className='laudo' key={index}>
                                        <input className='tipo-regra' type="text" value={regra.reg_tipo} readOnly />
                                        <input className='limitacao' type="text" value={regra.reg_valor} readOnly />
                                        <div className='divCheckbox'>
                                            <span className='resultadoCheckbox'>Resultado:</span>
                                            <input className='manipular-regra' type="text" placeholder='Insira um Número' 
                                            value={analises[index].valor} 
                                            onChange={(evento) => manipularRegra(index, evento.target.value)}
                                            onBlur={(evento) => blurRegra(index, evento.target.value)}
                                            onFocus={(evento) => focusRegra(index, evento.target.value)} 
                                            required />
                                        </div>
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
                                <button type="button" onClick={(evento) => validaAnalises('Editar')} className="confirm_button">Editar</button>
                            </div>
                        }

                    </div>
                    <br />
                </form>
            </>
        )
    }
    else {
        return (
            <>
                <NavBar />
                <form className='responsividadeforms'>
                    <div className="mainContent">
                        <div className="botoesNavegacao">
                            <button className='botaoteste4' type='button' onClick={irQuantitativa}>
                                <img src={teste} alt="" className="testeaEsquerda" />Análise Quantitativa</button>
                            <h1 className="mainTitle">ANÁLISE QUALITATIVA</h1>
                            <button className='botaoteste4' type='button' onClick={() => {navigate('/listaPedidos')}}>
                                Relatório Final<img src={teste} alt="" className="testeaDireita" /></button>
                        
                        </div>
                        <br />
                        <div className='laudo'>
                            <input className='tipo-laudo' type="text" value={'Laudo'} readOnly /> <input className='haver' type="text" value={'Deve haver'} readOnly />
                            <div className='divCheckbox'>
                                <span className='resultadoCheckbox'>Resultado:</span>
                                {laudo === 'sim' &&
                                    <input className='checkbox' type="checkbox" checked readOnly />
                                }
                                {laudo === 'não' &&
                                    <input className='checkbox' type="checkbox" readOnly />
                                }
                            </div>
                            
                        </div>
                        {regras.map((regra, index) => {
                            if (regra.reg_tipo === 'Avaria') {
                                return (
                                    <div className='laudo' key={index}>
                                        <input className='tipo-avaria' type="text" value={regra.reg_tipo} readOnly /> 
                                        <input className='regra-valor' type="text" value={regra.reg_valor} readOnly />
                                        <div className='divCheckbox'>
                                            <span className='resultadoCheckbox'>Resultado:</span>
                                        </div>
                                        {analises[index].valor === 'true' &&
                                            <><input className='checkbox' type="checkbox" checked readOnly /> <br/> </>
                                        }
                                        {analises[index].valor === 'false' &&
                                            <><input className='checkbox' type="checkbox" disabled /> <br/> </>
                                        }
                                        <input className='descricao' type="text" value={analises[index].avaria} readOnly />
                                        
                                        
                                    </div>
                                )
                            } else if (regra.reg_tipo === 'Personalizada') {
                                return (
                                    <div className='laudo' key={index}>
                                        <input className='personalizar' type="text" value={regra.reg_tipo} readOnly /> 
                                        <input className='regra-valor' type="text" value={regra.reg_valor} readOnly />
                                        <div className='divCheckbox'>
                                            <span className='resultadoCheckbox'>Resultado:</span>
                                            {analises[index].valor === 'true' &&
                                                <input className='checkbox' type="checkbox" checked readOnly />
                                            }
                                            {analises[index].valor === 'false' &&
                                                <input className='checkbox' type="checkbox" disabled />
                                            }
                                        </div>
                                        
                                    </div>
                                )

                            } else {
                                return (
                                    <div className='laudo' key={index}>
                                        <input className='tipo-regra' type="text" value={regra.reg_tipo} readOnly /> <input className='limitacao' type="text" value={regra.reg_valor} readOnly />
                                        <input className='manipular-regra' type="text" value={analises[index].valor} readOnly />
                                    </div>
                                )
                            }
                        })
                        }
                        <div className='mesmalinha'>
                            <button type="button" onClick={cancelaVoltaListagem} className="cancel_button">Voltar</button>
                        </div>

                    </div>
                </form>
            </>
        )
    }

}
export default AnaliseQuali