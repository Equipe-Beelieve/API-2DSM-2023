import React from 'react';
import { useState, useEffect } from 'react';
import api from '../services/api';
import { redirect, useNavigate } from 'react-router-dom';
import verificaLogado from '../funcoes/verificaLogado';
import NavBar from './NavBar';
import logo from '../images/logo.png'


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
        
        <div className='login2'>
            <div className='login-center'>
        <div className='mainContent'>
        <div className='state'>
        <h1></h1><form onSubmit={entrar}>
            <br></br>
            <p></p>
            <div className='logocentro'>
        <img className="logo" src={logo} alt="logo"/></div>
        <br></br>
            <h3 className='login-text'>Login:</h3>
            <input type="text" value={login} onChange={(e) => setLogin(e.target.value)} />
            <h3 className='login-text'>Senha:</h3>
            <input type="text" value={senha} onChange={(e) => setSenha(e.target.value)} />
            <p></p>
            <input type="submit" className="login_button" />
        </form>
        </div></div></div></div>
        </>
        
    )
}

export default Login