import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import verificaLogado from '../funcoes/verificaLogado';
import NavBar from './NavBar';

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

    async function confirmaVoltaListagem(){
            const post = {id, analises}
            navigate('/listaPedidos')
            await api.post('/postQualitativa', {post})  
    }

    async function confirmaContinua() {
        const post = {analises}
        await api.post('/postQualitativa', { post })
        navigate(`/`) //substituir pela rota do relatório final, quando pronta        
    }

    function cancelaVoltaListagem(){
        navigate('/listaPedidos')
    }

    function estado() {
        console.log(analises)
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
        <form action="">
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
                        <input type="text" onChange={(evento) => manipularRegra(index, evento.target.value)}/>
                    </div>
                )
            }
        })
        }
            <button type="button" onClick={cancelaVoltaListagem} className="cancel_button">Cancelar</button>
            <button type="button" onClick={confirmaVoltaListagem} className="confirm_button">Confirmar e voltar para a home</button>
            <button type="button" onClick={confirmaContinua} className="confirm_button">Confirmar e continuar</button>
        </form>
        <button onClick={(evento) => estado()}>ANALISES</button>
        </>
    )
}
export default AnaliseQuali