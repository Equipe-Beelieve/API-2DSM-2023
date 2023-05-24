import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import { Outlet, useLocation, useParams } from "react-router-dom"
import './App.css';
import NavBar from './components/NavBar';
import Login from './components/Login';
import api from './services/api';
import { ToastContainer } from 'react-toastify';

function App() {
  const [log, setLog] = useState(Boolean)
  const [pageTitle, setPageTitle] = useState('')
  const rota = useLocation()
  const {id} = useParams()
  
  async function getLogin(){
    const login = await api.get('/confereLogado')
    console.log(`Session: ${login.data}`)
    if (login.data){
      setLog(true)
    }
    else{
      setLog(false)
    }
  }

  useEffect(()=>{
    getLogin()
    document.title = pageTitle;
    switch(rota.pathname){
      case '/':
        setPageTitle('Sabiá')
        break
      case '/listaPedidos':
        setPageTitle('Sabiá | Pedidos')
        break
      case '/cadastroPedido':
        setPageTitle('Sabiá | Cadastro de Pedidos')
        break
      case `/cadastroPedido/${id}`:
        setPageTitle(`Sabiá | Revisão de Pedido`)
        break
      case `/recebePedido/${id}`:
        setPageTitle('Sabiá | Recebimento de Pedido')
        break
      case `/listaFornecedor`:
        setPageTitle('Sabiá | Fornecedores')
        break
      case `/cadastroFornecedor`:
        setPageTitle('Sabiá | Cadastro de fornecedor')
        break
      case `/cadastroFornecedor/${id}`:
        setPageTitle('Sabiá | Edição de fornecedor')
        break;
      case `/listaUsuario`:
        setPageTitle('Sabiá | Usuários')
        break
      case `/cadastroUsuario`:
        setPageTitle('Sabiá | Cadastro de usuário')
        break
      case `/cadastroUsuario/${id}`:
        setPageTitle('Sabiá | Edição de usuário')
        break
      case `/listaProdutos`:
        setPageTitle('Sabiá | Produtos')
        break
      case `/cadastroProduto`:
        setPageTitle('Sabiá | Cadastro de produto')
        break
      case `/cadastroProduto/${id}`:
        setPageTitle('Sabiá | Edição do produto')
        break
      case `/`:
        setPageTitle('Sabiá | Cadastro de fornecedor')
        break
      case `/analiseQuant/${id}`:
        setPageTitle('Sabiá | Análise Quantitativa')
        break
      case `/analiseQuali/${id}`:
        setPageTitle('Sabiá | Análise Qualitativa')
        break
      case `/relatorioFinal/${id}`:
        setPageTitle('Sabiá | Relatório Final')
        break
    }
  },[pageTitle, rota, id])
  
  return (
  <>
  <ToastContainer/>
  <Outlet />
  </>
  )


}

export default App;
