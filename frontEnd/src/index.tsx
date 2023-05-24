import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import './stylesheets/styles.css'
import './stylesheets/boxCadastro.css'
import App from './App';
import reportWebVitals from './reportWebVitals';
import CadFornecedor from './components/CadFornecedor';


import { createBrowserRouter, RouterProvider } from 'react-router-dom';
//import NavBar from './components/NavBar';
import ListaPedidos from './components/ListaPedidos';
import CadPedido from './components/CadPedido';
import ListaFornecedor from './components/ListaFornecedor';
import Login from './components/Login';
import ListaUsuario from './components/ListaUsuario';
import CadProduto from './components/CadProduto';
import ListaProdutos from './components/ListaProdutos';
import CadUsuario from './components/CadUsuario';
import RecebimentoPedido from './components/RecebimentoPedido';
import AnaliseQuant from './components/AnaliseQuant';
import AnaliseQuali from './components/AnaliseQuali';
import RelatorioFinal from './components/RelatorioFinal';


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
        path: "/cadastroPedido",
        element: <CadPedido/>
      },
      {
        path: "/cadastroPedido/:id",
        element: <CadPedido/>
      },
      {
        path: "/cadastroProduto/:id",
        element: <CadProduto/>
      },
      {
        path: "/recebePedido/:id",
        element: <RecebimentoPedido/>
      },
      {
        path: "/listaFornecedor",
        element: <ListaFornecedor/>
      },
      {
        path: "/cadastroFornecedor",
        element: <CadFornecedor/>
      },
      {
        path: "/listaUsuario",
        element: <ListaUsuario/>
      },
      {
        path: "/cadastroProduto",
        element: <CadProduto/>
      },
      {
        path: "/listaProdutos",
        element: <ListaProdutos/>
      },
      {
        path: "/cadastroUsuario",
        element: <CadUsuario/>
      },
      {
        path: "/cadastroUsuario/:id",
        element: <CadUsuario/>
      },
      {
        path: "/analiseQuant/:id",
        element: <AnaliseQuant/>
      },
      {
        path: "/analiseQuali/:id",
        element: <AnaliseQuali/>
      },
      {
        path: "/relatorioFinal/:id",
        element: <RelatorioFinal/>
      }
        

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
