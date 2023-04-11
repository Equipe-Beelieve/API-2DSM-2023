import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import { Outlet } from "react-router-dom"
import './App.css';
import NavBar from './components/NavBar';
import Login from './components/Login';
import api from './services/api';

function App() {
  const [log, setLog] = useState(Boolean)
  
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
  },[])
  
  return (
  <>
  
  <Outlet />
  </>
  )


}

export default App;
