import React from 'react';
import { useState, useEffect } from 'react';
import api from '../services/api';
import { redirect, useNavigate } from 'react-router-dom';
import verificaLogado from '../funcoes/verificaLogado';
import NavBar from './NavBar';


function Login(){
    const [senha, setSenha] = useState('')
    const [login, setLogin] = useState('')
    const [logado, setLogado] = useState(Boolean)
    let navegate = useNavigate()

    

    function entrar(evento:any){
        evento.preventDefault()
        const post = {senha, login}
        api.post('/login', post).then((res)=>{
            if(res.data){
                console.log(res.data)
                navegate("/listaPedidos")
            }
            else{
                console.log(res)
                navegate('/')
            }
        })

    }

    async function veLogado(){
        let situacao = await verificaLogado()
        setLogado(situacao.logado)
    }


    useEffect(()=>{
        veLogado()
        if (logado){
            navegate('/listaPedidos')
        }
        else{
            navegate('/')
        }

    }, [])
    return(
        <>
        <h1>Login</h1><form onSubmit={entrar}>
            <h3>Login:</h3>
            <input type="text" value={login} onChange={(e) => setLogin(e.target.value)} />
            <h3>Senha:</h3>
            <input type="text" value={senha} onChange={(e) => setSenha(e.target.value)} />
            
            <input type="submit" />
        </form>
        </>
        
    )
}

export default Login