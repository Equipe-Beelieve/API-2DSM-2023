import React from 'react';
import { useState, useEffect } from 'react';
import api from '../services/api';
import NavBar from "./NavBar";
import { Link, redirect, useNavigate } from 'react-router-dom';
import { RedirectFunction } from 'react-router-dom';
import { Fornecedor } from './ListaFornecedor';
import { Produto } from './ListaProdutos';
import verificaLogado from '../funcoes/verificaLogado';

function CadPedido(){

    const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]) //Fornecedores que virão do bd
    const [produtos, setProdutos] = useState<Produto[]>([]) //Produtos que virão do bd

    const [produto, setProduto] = useState('')
    const [dataPedido, setDataPedido] = useState('')
    const [dataEntrega, setDataEntrega] = useState('')
    const [razaoSocial, setRazaoSocial] = useState('')
    const [precoUnitario, setPrecoUnitario] = useState('')
    const [quantidade, setQuantidade] = useState('')
    const [precoTotal, setPrecoTotal] = useState('')
    const [frete, setFrete] = useState('')
    const [transportadora, setTransportadora] = useState('')
    const [condicaoPagamento, setCondicaoPagamento] = useState('')


    const [logado, setLogado] = useState(Boolean)
    const navegate = useNavigate()

    

    // função que pega os fornecedores
    const getFornecedor = async () => {
        try{
            const resposta = await api.get('/cadastroPedido')
            //console.log(resposta.data.razaoSocial)
            setFornecedores(resposta.data.razaoSocial) //pegando os dados da resposta
        }
        catch(error){
            console.log(error)
        }
        
    }

    // função que pega os produtos
    async function getProdutos() {
        try {
            const resposta = await api.get('/cadastroPedido')
            //console.log(resposta.data.produtos)
            setProdutos(resposta.data.produtos)

        } catch (error) {
            console.log(error)
        }
    }

    function trataDatalistProduto (evento:any){
        for(let i in produtos){
            if (produto === produtos[i].prod_descricao){
                setProduto(evento.target.value)
                return;
            }
        }
        setProduto('')
    }

    function trataDatalistFornecedor(evento:any){
        for(let i in fornecedores){
            if (razaoSocial === fornecedores[i].for_razao_social){
                setRazaoSocial(evento.target.value)
                return;
            }
        }
        setRazaoSocial('')
    }

    useEffect(()=>{
        async function veLogado(){
            let resultado = await verificaLogado()
            //setLogado(resultado)
            if (resultado.logado){
                getFornecedor()
                getProdutos()
                if (resultado.funcao !== 'Administrador' && resultado.funcao !== 'Gerente'){
                    navegate('/listaPedidos')
                }
            }
            else{
                navegate('/')
            }
        }
        veLogado()
        
    }, []) //Aciona as funções apenas quando a página é renderizada

    function cadastroPedido(evento:any){
        evento.preventDefault();
        const post ={produto, dataPedido, dataEntrega, razaoSocial, precoUnitario, quantidade, precoTotal, frete, transportadora, condicaoPagamento}
        api.post('/postCadastroPedido',
            {post}
        )
        redirect('/')
    }

    return(
        <>
        <NavBar />
        <div className="divFornecedor">
            <h1>Cadastro de Pedidos</h1>
            <form onSubmit={cadastroPedido}>

                <div className="poscentralized grid-container">
                    <div className="box">
                        <table>
                            <thead>
                                <tr>
                                    <th>Produto:</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><input list='datalistProduto' type='text' className="input_form" name="produto" id="produto" 
                                    required 
                                    value={produto} 
                                    onChange={(e)=>{setProduto(e.target.value)}}
                                    onBlur={trataDatalistProduto}/>
                                        <datalist id='datalistProduto'>
                                            <option value=""></option>
                                            {produtos.map((produto, index) =>(
                                                    <option value={produto.prod_descricao} key={index}>{produto.prod_descricao}</option>
                                            ))}
                                        </datalist>
                                        
                                    

                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="box">
                        <table>
                            <thead>
                                <tr>
                                    <th>Data do Pedido:</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><input className="input_form" type="date" id="dataPedido" name="dataPedido" required 
                                    value={dataPedido}
                                    onChange={(e)=>{setDataPedido(e.target.value)}}/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="box">
                        <table>
                            <thead>
                                <tr>
                                    <th>Data de Entrega:</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><input className="input_form" type="date" id="dataEntrega" name="dataEntrega" required 
                                    value={dataEntrega}
                                    onChange={(e)=>{setDataEntrega(e.target.value)}}/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="poscentralized grid-container">
                    <div className="box">
                        <table>
                            <thead>
                                <tr>
                                    <th>Razão Social(fornecedor):</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <input type='text' list='datalistFornecedor' className="input_form" id="razaoSocial" name="razaoSocial" required 
                                        value={razaoSocial}
                                        onChange={(e)=>{setRazaoSocial(e.target.value)}}
                                        onBlur={trataDatalistFornecedor}/>
                                            <datalist id='datalistFornecedor'>
                                                <option value=""></option>
                                                {fornecedores.map((fornecedor, index) =>(
                                                    <option value={fornecedor.for_razao_social} key={index}>{fornecedor.for_razao_social}</option>
                                                ))
                                                }
                                            </datalist>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>


                    <div className="box">
                        <table>
                            <thead>
                                <tr>
                                    <th>Preço Unitário:</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><input className="input_form" type="text" id="precoUnitario" name="precoUnitario"
                                        required 
                                        value={precoUnitario}
                                        onChange={(e)=>{setPrecoUnitario(e.target.value)}}/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="box">
                        <table>
                            <thead>
                                <tr>
                                    <th>Quantidade:</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><input className="input_form" type="text" id="quantidade" name="quantidade" required
                                    value={quantidade}
                                    onChange={(e)=>{setQuantidade(e.target.value)}} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="poscentralized grid-container">
                    <div className="box">
                        <table>
                            <thead>
                                <tr>
                                    <th>Preço Total:</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><input className="input_form" type="text" id="precoTotal" name="precoTotal" required 
                                    value={precoTotal}
                                    onChange={(e)=>{setPrecoTotal(e.target.value)}}/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="box">
                        <table>
                            <thead>
                                <tr>
                                    <th>Tipo de Frete:</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><input className="input_form" type="text" id="frete" name="frete" required 
                                    value={frete}
                                    onChange={(e)=>{setFrete(e.target.value)}}/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="box">
                        <table>
                            <thead>
                                <tr>
                                    <th>Transportadora:</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><input className="input_form" type="text" id="condicaoPagamento" name="transportadora"
                                        required 
                                        value={transportadora}
                                        onChange={(e)=>{setTransportadora(e.target.value)}}/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="poscentralized grid-container">
                    <div className="box">
                        <table>
                            <thead>
                                <tr>
                                    <th>Condição de Pagamento:</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><select className="input_form" name="condicaoPagamento" id="condicaoPagamento" required 
                                    value={condicaoPagamento}
                                    onChange={(e)=>{setCondicaoPagamento(e.target.value)}}>
                                        <option value=""></option>
                                        <option value="00/100">00/100</option>
                                        <option value="10/90">10/90</option>
                                        <option value="20/80">20/80</option>
                                        <option value="30/70">30/70</option>
                                        <option value="40/60">40/60</option>
                                        <option value="50/50">50/50</option>
                                        <option value="60/40">60/40</option>
                                        <option value="70/30">70/30</option>
                                        <option value="80/20">80/20</option>
                                        <option value="90/10">90/10</option>
                                        <option value="100/00">100/00</option>
                                    </select>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>

                
                <input className="confirm_button" type="submit" value="Cadastrar" />
                
                    
                <button className="cancel_button">
                    <Link to={"/listaPedidos"}>Cancelar</Link>
                </button>
            </form>
        </div>
        </>

    )
}

export default CadPedido

