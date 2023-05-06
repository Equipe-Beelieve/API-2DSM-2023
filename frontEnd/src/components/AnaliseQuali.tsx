import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import verificaLogado from '../funcoes/verificaLogado';
import NavBar from './NavBar';

export interface Regra {
    reg_codigo:number
    reg_tipo:string
    reg_valor:string
    reg_obrigatoriedade:boolean
}

function AnaliseQuali() {
    const [regras, setRegras] = useState<Regra[]>([])
    const {id} = useParams()

    const navigate = useNavigate()

    async function getRegras() {
        try {
            const response = await api.get(`/analiseQuali/${id}`)
            console.log(response.data)
            setRegras(response.data)
        } catch (erro) {
            console.log(erro)
        }
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
    },[])

    return (
        <>
        <NavBar/>
        {regras.map((regra, index) => (
            <div key={index}>
                <p>{regra.reg_codigo}, {regra.reg_tipo}, {regra.reg_valor}</p>
            </div>
        ))

        }
        </>
    )
}
export default AnaliseQuali