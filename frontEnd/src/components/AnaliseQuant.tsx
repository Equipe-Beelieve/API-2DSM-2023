import React from 'react';
import { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from './NavBar';

interface Pedido{
    ped_produto_massa:string
}


function AnaliseQuant(){
    const [pesagem, setPesagem] = useState('')
    const [peso, setPeso] = useState('')
    const [tipoPeso, setTipoPeso] = useState('')
    const [mudanca, setMudanca] = useState('')

    async function getPeso(){
        try {
            let post = id
            const response = await api.post('/confereUnidade', {post})
            console.log(response.data)
            setPeso(response.data)
            }
            catch (erro) {
            console.log(erro)
            }
    }

    async function veStatus() {
        let status = await api.post('/confereStatus', {id:id, acessando:'Análise Quantitativa'})
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

    const {id} = useParams()
    const navegate = useNavigate()

    async function confiraTipoPeso(){
        const valor = peso
        let final = valor.slice(-1);
        if (final === 't'){
            setTipoPeso('Toneladas')
        }
        else{
            setTipoPeso('Quilogramas')
        }
    }

      // ====================== Botões ======================

    async function confirmaVoltaListagem(){
        const post = {id, pesagem}
        navegate('/listaPedidos')
        await api.post('/postQuantitativa', {post})  
    }

    async function confirmaContinua() {
        const post = {id, pesagem}
        await api.post('/postQuantitativa', { post })
        navegate(`/analiseQuali/${id}`)       
    }

    function cancelaVoltaListagem(){
        navegate('/listaPedidos')
    }

    useEffect(() => {
        getPeso()
        confiraTipoPeso()
        veStatus()
    },[])

    return(
        <>
        <NavBar/>
        <div className="mainContent">
            <div className="titleRegister">
                <h1 className="mainTitle">ANÁLISE QUANTITATIVA</h1>
            
            </div>
            <div className="uni_quant">Unidade: {tipoPeso}
            </div>
            <div className='anaq1'>
                <div className='anaq2'>
                    Resultado da pesagem:
                </div>
                <input type="text" className='input_form2' value={pesagem} onChange={(e) => {setPesagem(e.target.value)}} required></input>
            </div>
                <div className='mesmalinha'>
                    <button type="button" onClick={confirmaVoltaListagem} className="confirm_button">Confirmar e voltar para a home</button>
                    <button type="button" onClick={confirmaContinua} className="confirm_button">Confirmar e continuar</button></div>
                    <button type="button" onClick={cancelaVoltaListagem} className="cancel_button">Cancelar</button>

        </div>
        </>
    )
}

export default AnaliseQuant