import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import './stylesheets/styles.css'
import './stylesheets/boxCadastro.css'
import App from './App';
import reportWebVitals from './reportWebVitals';
import CadFornecedor from './components/CadFornecedor';


import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import ListaPedidos from './components/ListaPedidos';
import CadPedido from './components/CadPedido';
import ListaFornecedor from './components/ListaFornecedor';
import Login from './components/Login';
import ListaUsuario from './components/ListaUsuario';


const router = createBrowserRouter([
  {
    element:<App />,
    children: [
      {
        path: "/",
        element: <Login/>
      },
      {
        path: "/listaPedidos",
        element: <ListaPedidos/>
      },
      {
        path: "/cadastroFornecedor",
        element: <CadFornecedor/>
      },
      {
        path: "/cadastroPedido",
        element: <CadPedido/>
      },
      {
        path: "/listaFornecedor",
        element: <ListaFornecedor/>
      },
      {
        path: "/listaUsuario",
        element: <ListaUsuario/>
      },
    ]
  }
])



const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
