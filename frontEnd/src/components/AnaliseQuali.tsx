import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import verificaLogado from '../funcoes/verificaLogado';
import NavBar from './NavBar';
import { toast } from 'react-toastify';

interface Regra {
    reg_codigo:number
    reg_tipo:string
    reg_valor:string
    reg_obrigatoriedade:boolean
}

interface Analise {
    tipo?:string
    valor?:string
    avaria?:string
}

function AnaliseQuali() {
    const [regras, setRegras] = useState<Regra[]>([])
    const [analises, setAnalises] = useState<Analise[]>([])
    const [laudo, setLaudo] = useState('não')
    const [mudanca, setMudanca] = useState('')
    const {id} = useParams()

    const navigate = useNavigate()

    async function getRegras() {
        try {
            const response = await api.get(`/analiseQuali/${id}`)
            //console.log(response.data)
            const regras = response.data
            const padraoAnalises = regras.map((regra:Regra) => {
                if(regra.reg_tipo === 'Avaria') {
                    return {
                        tipo: regra.reg_tipo,
                        valor: 'false',
                        avaria: ''
                    }
                } else {
                    return {
                        tipo: regra.reg_tipo,
                        valor: 'false',  
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
        let status = await api.post('/confereStatus', {id:id, acessando:'Análise Qualitativa'})
        let dado = status.data
        console.log(dado)
        if (status.data === 'Primeira vez'){
            setMudanca('Primeira vez')
        }
        else if (status.data === 'Revisão'){
            setMudanca('Revisão')
        }
        else {
            setMudanca('Edição')
            
        }
        console.log(status.data)
    }

    function manipularAvaria(index:number, comentario:string) {
        const analiseAvaria:Analise = {
            avaria: comentario
        }

        const analiseNova = [...analises]
        analiseNova[index].avaria = analiseAvaria.avaria
        setAnalises(analiseNova)
    }
    
    function manipularCheckboxAvaria(index:number, check:boolean){
        const analiseAvaria:Analise = {
            valor: check ? 'true' : 'false'
        }

        const analiseNova = [...analises]
        analiseNova[index].valor = analiseAvaria.valor
        setAnalises(analiseNova)
        
    }

    function manipularRegraPersonalizada(index:number, check:boolean) {
        const analiseRegra:Analise = {
            valor: check ? 'true' : 'false'
        }
        const analiseNova = [...analises]
        analiseNova[index].valor = analiseRegra.valor
        setAnalises(analiseNova)
        
    }

    function manipularRegra(index:number, valor:string) {
        const analiseRegra = {
            valor: valor
        }

        const analiseNova = [...analises]
        analiseNova[index].valor = analiseRegra.valor
        setAnalises(analiseNova)
    }

    function validaAnalises(acao:string) {
        const analisesNumericas = analises.filter((analise) => {
            return analise.tipo !== 'Avaria' && analise.tipo !== 'Personalizada'
        })
        if(acao === 'Continuar'){
            if(analisesNumericas.every((analise) => analise.valor !== 'false')){
                confirmaContinua()
            } else {
                toast.error('Preencha todas as análises.', {position: 'bottom-left', autoClose: 2500,
                className: 'flash', hideProgressBar: true, pauseOnHover: false, theme: "dark"})
            }
        } else if(acao === 'Voltar'){
            if(analisesNumericas.every((analise) => analise.valor !== 'false')){
                confirmaVoltaListagem()
            } else {
                toast.error('Preencha todas as análises.', {position: 'bottom-left', autoClose: 2500,
                className: 'flash', hideProgressBar: true, pauseOnHover: false, theme: "dark"})
            }
        } 
    }

    async function confirmaVoltaListagem(){
        const post = {id, analises, laudo}
        navigate('/listaPedidos')
        await api.post('/postQualitativa', {post})  
    }

    async function confirmaContinua() {
        const post = {id, analises, laudo}
        await api.post('/postQualitativa', { post })
        navigate(`/`) //substituir pela rota do relatório final, quando pronta        
    }

    function cancelaVoltaListagem(){
        navigate('/listaPedidos')
    }

    function estado() {
        console.log(analises, laudo)
    }
    //================== Botões ==================
    function irQuantitativa(){
        navigate(`/analiseQuant/${id}`)
    }

    function irRegularizacao(){
        
    }


    useEffect(()=>{
        async function veLogado(){
            let resultado = await verificaLogado()
            if (resultado.logado){
                getRegras()
                if (resultado.funcao !== 'Administrador' && resultado.funcao !== 'Gerente'){
                    navigate('/listaPedidos')
                }
            } else {
                navigate('/')
            }
        } veLogado()
    }, [])

    return (
        <>
        <NavBar/>
        <form >
            <div className="mainContent">
                <div className="titleRegister">
                    <h1 className="mainTitle">ANÁLISE QUALITATIVA</h1>
                </div>
                {mudanca === 'Edição' &&
                    <button type='button' onClick={irRegularizacao}>Relatório Final</button>
                }
                <button type='button' onClick={irQuantitativa}>Análise Quantitativa</button>
                <div>
                    <input type="text" value={'Laudo'} readOnly/> <input type="text" value={'Deve haver'} readOnly/>
                    <input type="checkbox" onChange={(evento) => setLaudo(laudo === 'sim' ? 'não' : 'sim')}/>
                </div>
                {regras.map((regra, index) => {
                    if(regra.reg_tipo === 'Avaria') {
                        return (
                            <div key={index}>
                                <input type="text" value={regra.reg_tipo} readOnly/> <input type="text" value={regra.reg_valor} readOnly/>
                                <input type="checkbox" onChange={(evento) => manipularCheckboxAvaria(index, evento.target.checked)}/> <br/>
                                <input type="text" onChange={(evento) => manipularAvaria(index, evento.target.value)}/>
                            </div>
                        )
                    } else if(regra.reg_tipo === 'Personalizada') {
                        return (
                            <div key={index}>
                                <input type="text" value={regra.reg_tipo} readOnly/> <input type="text" value={regra.reg_valor} readOnly/>
                                <input type="checkbox" onChange={(evento) => manipularRegraPersonalizada(index, evento.target.checked)}/>
                            </div>
                        )
                        
                    } else {
                        return (
                            <div key={index}>
                                <input type="text" value={regra.reg_tipo} readOnly/> <input type="text" value={regra.reg_valor} readOnly/>
                                <input type="text" onChange={(evento) => manipularRegra(index, evento.target.value)} required/>
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
export default AnaliseQuali