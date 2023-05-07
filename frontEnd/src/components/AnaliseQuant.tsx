import React from 'react';
import { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from './NavBar';

interface Analise {
    pesagem?: string
}

function AnaliseQuant(){

    const [analises, setAnalises] = useState<Analise[]>([])
    const {id} = useParams()

    const navigate = useNavigate()

      // ====================== Botões ======================

//       async function confirmaVoltaListagem(){
//         const post = {id, analises}
//         navigate('/listaPedidos')
//         await api.post('/postQuantitativa', {post})  
// }

// //     async function confirmaContinua() {
// //     const post = {analises}
// //     await api.post('', { post })
// //     navigate(`/`)       
// // }

    function cancelaVoltaListagem(){
    navigate('/listaPedidos')
}



    return(
        <>
        <NavBar/>
        <div className="mainContent">
            <div className="titleRegister">
                <h1 className="mainTitle">ANÁLISE QUANTITATIVA</h1>
            
            </div>
            <div className="uni_quant">Unidade:
            </div>
            <div className='anaq1'>
                <div className='anaq2'>
                    Resultado da pesagem:
                </div>
                <input type="text" className='input_form2'></input>
            </div>
                    <>
                    {/* <button type="button" onClick={confirmaVoltaListagem} className="confirm_button">Confirmar e voltar para a home</button> */}
                    {/* <button type="button" onClick={confirmaContinua} className="confirm_button">Confirmar e continuar</button> */}
                    <button type="button" onClick={cancelaVoltaListagem} className="cancel_button">Cancelar</button>
                    </>
        </div>
        </>
    )
}

export default AnaliseQuant

function navigate(arg0: string) {
    throw new Error('Function not implemented.');
}
