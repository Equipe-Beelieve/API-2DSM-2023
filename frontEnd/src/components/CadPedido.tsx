import React from 'react';
import { useState, useEffect } from 'react';
import api from '../services/api';
import NavBar from "./NavBar";
import { useNavigate} from 'react-router-dom';
import { redirect } from 'react-router-dom';
import { Fornecedor } from './ListaFornecedor';
import { Produto } from './ListaProdutos';
import verificaLogado from '../funcoes/verificaLogado';

function CadPedido(){

// ===================== Estados =====================

    const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]) //Fornecedores que virão do bd
    const [produtos, setProdutos] = useState<Produto[]>([]) //Produtos que virão do bd
    const [unidade, setUnidade] = useState('')
    const [render, setRender] = useState(false)
    const [temVirgula, setTemVirgula] = useState(false)

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

// ===================== Ligações com o Backend =====================

    // função que pega os fornecedores
    const getFornecedor = async () => {
        try{
            const resposta = await api.get('/cadastroPedido')
            console.log(resposta.data)
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

    // ===================== Mascaras de campo =====================

    function trataPrecoUnitario(evento:any){
        let valor = evento.target.value
        if (isNaN(valor.slice(-1)) && unidade !== '' && valor.slice(-1) !=='.' && valor.slice(-1) !== ','){
            setPrecoUnitario(precoUnitario)
        } 
        else{
            if(!temVirgula && (valor.slice(-1) === ',' || valor.slice(-1) === '.')){
                setTemVirgula(true)
            }
            if (temVirgula && (valor.slice(-1) === ',' || valor.slice(-1) === '.')
            && valor.length > precoUnitario.length){
                setPrecoUnitario(precoUnitario)
            } 
            else if (temVirgula && (precoUnitario.slice(-1) === ',' || precoUnitario.slice(-1) === '.') 
            && valor.length < precoUnitario.length){
                setPrecoUnitario(valor)
                setTemVirgula(false)
            }
            else {setPrecoUnitario(valor)}
        }
    }

    function blurPrecoUnitario(evento:any){
        let valor = evento.target.value
        
        if (unidade !== ''){
            if(valor[0] !== 'R' && valor[0] !== '$' && valor.slice(-1) !== 't' && valor.slice(-1) !== 'g' 
            && valor.slice(-1) !== '/' && valor.slice(-1) !== 'k' && valor.slice(-1) !== ' ' && valor.slice(-1) !== ''){
                valor = valor.replace(',', '.')
                setPrecoUnitario('R$' + valor + '/' + unidade)
            }
            else if (valor.slice(-1) !== 'g' && valor.slice(-1) !== 't' && valor[0] !== 'R'){
                setPrecoUnitario('')
            }
            else{
                setPrecoUnitario(precoUnitario)
            }
        }
        else {
            setPrecoUnitario('')
            
        }
        setTemVirgula(false)
        
    }

    function selectPrecoUnitario(evento:any){
        let valor = evento.target.value
        if (valor[0] === 'R' && valor.slice(-1) === 't'){
            console.log(valor.slice(2, -2))
            setPrecoUnitario(valor.slice(2, -2))
        }
        else if (valor[0] === 'R' && valor.slice(-1) === 'g'){
            console.log(valor.slice(2, -2))
            setPrecoUnitario(valor.slice(2, -3))
        }
        if (valor.includes('.') || valor.includes(',')){
            setTemVirgula(true)
        }
    }



    function trataDatalistProduto (evento:any){
        for(let i in produtos){
            if (produto === produtos[i].prod_descricao){
                setProduto(evento.target.value)
                setUnidade(produtos[i].prod_unidade_medida)
                return;
            }
        }
        setUnidade('')
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

    function trataQuantidade(evento:any){
        let valor = evento.target.value
        if (isNaN(valor.slice(-1)) && unidade !== '' && valor.slice(-1) !== '.' && valor.slice(-1) !== ','){
            setQuantidade(quantidade)
        }
        else{
            if (!temVirgula && (valor.slice(-1) === '.' || valor.slice(-1) === ',')){
                setTemVirgula(true)
            }
            if (temVirgula && (valor.slice(-1) === '.' || valor.slice(-1) === ',')
            && valor.length > quantidade.length){
                console.log(`Valor Tamanho: ${valor.length} | Quantidade Tamanho: ${quantidade.length}`)
                setQuantidade(quantidade)
            } 
            else if (temVirgula && (quantidade.slice(-1) === ',' || quantidade.slice(-1) === '.')
            && valor.length < quantidade.length){
                setQuantidade(valor)
                setTemVirgula(false)
            }
            else{setQuantidade(valor)}
        }
    }
    function blurQuantidade(evento:any){
        let valor = evento.target.value
        if (unidade !== ''){
            if(valor.slice(-1) !== 't' && valor.slice(-1) !== 'g' 
            && valor.slice(-1) !== 'k' && valor.slice(-1) !== '' && valor.slice(-1) !== ' '){
                valor = valor.replace(',', '.')
                setQuantidade(valor + ' ' + unidade)
            }
            else if (valor.slice(-1) !== 't' && valor.slice(-1) !== 'g'){
                setQuantidade('')
            }
            else{
                setQuantidade(quantidade)
            }
        }
        else {
            setQuantidade('')
        }
        setTemVirgula(false)
    }

    
    function selectQuantidade(evento:any){
        let valor = evento.target.value
        if (valor.slice(-1) === 't'){
            setQuantidade(valor.slice(0, -2))
        }
        else if (valor.slice(-1) === 'g'){
            setQuantidade(valor.slice(0, -3))
        }
        if (valor.includes('.') || valor.includes(',')){
            setTemVirgula(true)
        }
    }

    // ===================== UseEffect =====================

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
        if (!render){
            veLogado()
            setRender(true)
        }
        if (precoUnitario !== '' && quantidade !== ''){
            let preco
            let quant
            if (precoUnitario.slice(-1) === 't'){
                preco = precoUnitario.slice(2, -2)
                quant = quantidade.slice(0, -2)
                if (preco.includes(',')){preco = preco.replace(',', '.')}
                if (quant.includes(',')){quant = quant.replace(',', '.')}
                preco = parseFloat(preco)
                quant = parseFloat(quant)
            }
            else {
                preco = precoUnitario.slice(2, -3)
                quant = quantidade.slice(0, -3)
                if (preco.includes(',')){preco = preco.replace(',', '.')}
                if (quant.includes(',')){quant = quant.replace(',', '.')}
                preco = parseFloat(preco)
                quant = parseFloat(quant)
            }
            if (!isNaN(preco*quant)){
                setPrecoTotal(`R$ ${preco * quant}`)
            }

        }
        if (((precoUnitario.slice(-1) === 'g' || quantidade.slice(-1) === 'g') && unidade === "t")){
            setQuantidade(quantidade.replace('kg', 't'))
            setPrecoUnitario(precoUnitario.replace('kg', 't'))
        }
        if (((precoUnitario.slice(-1) === 't' || quantidade.slice(-1) === 't') && unidade === "kg")){
            setQuantidade(quantidade.replace('t', 'kg'))
            setPrecoUnitario(precoUnitario.replace('t', 'kg'))
        }
    }, [navegate, precoUnitario, quantidade, render, unidade]) //Aciona as funções apenas quando a página é renderizada


// ===================== Submit =====================

    async function cadastroPedido(evento:any){

        if (unidade === 'kg'){
            setPrecoUnitario(precoUnitario.slice(2, -3))
            setPrecoTotal(precoTotal.slice(3))
            setQuantidade(quantidade.slice(0, -3))
        }
        else{
            setPrecoUnitario(precoUnitario.slice(2, -2))
            setPrecoTotal(precoTotal.slice(3))
            setQuantidade(quantidade.slice(0, -2))
        }
        const post ={produto, dataPedido, dataEntrega, razaoSocial, precoUnitario, quantidade, precoTotal, frete, transportadora, condicaoPagamento}
        navegate("/listaPedidos")
        await api.post('/postCadastroPedido', {post})

        
    }

    function redirecionarPedido(){
        navegate("/listaPedidos")
    }

// ===================== HTML =====================  

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
                                        onChange={trataPrecoUnitario}
                                        onBlur={blurPrecoUnitario}
                                        onSelect={selectPrecoUnitario}/>
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
                                    onChange={trataQuantidade}
                                    onBlur={blurQuantidade}
                                    onSelect={selectQuantidade} />
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
                                    <td><input className="input_form" type="text" id="precoTotal" name="precoTotal" required readOnly
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
                                    <td><select className="input_form" id="frete" name="frete" required 
                                    value={frete}
                                    onChange={(e)=>{setFrete(e.target.value)}}>
                                        <option value=""></option>
                                        <option value="Barco">Barco</option>
                                        <option value="Trem">Trem</option>
                                        <option value="Caminhão">Caminhão</option>
                                        <option value="Avião">Avião</option>
                                    </select>
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

                
                <input className="confirm_button" type="submit" value="Cadastrar"/>
                <button className="cancel_button" onClick={redirecionarPedido}>Cancelar</button>
            </form>
        </div>
        </>

    )
}

export default CadPedido

