import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import NavBar from "./NavBar"
import { Produto } from "./ListaProdutos"
import api from "../services/api"
import { toast } from "react-toastify"
import verificaLogado from "../funcoes/verificaLogado"
import teste from '../images/seta-esquerda.png'

function RecebimentoPedido() {

    //=================== Estados e Hooks ===================

    const [cnpj, setCnpj] = useState('')
    const [produto, setProduto] = useState('')
    const [transportadora, setTransportadora] = useState('')
    const [condicaoPagamento, setCondicaoPagamento] = useState('')
    const [quantidade, setQuantidade] = useState('')
    const [precoUnitario, setPrecoUnitario] = useState('')
    const [precoTotal, setPrecoTotal] = useState('')
    const [dataEntrega, setDataEntrega] = useState('')
    const [dataEmissao, setDataEmissao] = useState('')
    const [tipoFrete, setTipoFrete] = useState('')

    const [nfCodigo, setNfCodigo] = useState(0)
    const [unidade, setUnidade] = useState('')
    const [mudanca, setMudanca] = useState('')
    const [bdProduto, setBdProduto] = useState<Produto[]>([])
    const [temUnidade, setTemUnidade] = useState(false)
    const [temVirgula, setTemVirgula] = useState(false)
    const [renderUm, setRenderUm] = useState(true)
    const navegate = useNavigate()

    const cnpjRef = useRef(null)
    const [controleCnpj, setControleCnpj] = useState(0)
    const { id } = useParams()

    //Tratamento do CNPJ
    function trataCnpj(evento:any){
        let valor = evento.target.value
        if(isNaN(valor[valor.length-1]) && valor[valor.length-1] !== '.' && valor[valor.length-1] !== '-' && valor[valor.length-1] !== '/' && valor[valor.length-1] !== undefined){
            setCnpj(cnpj)
        }
        else if (valor.length !== 3 && valor.length !== 7 && valor.length !== 11 && valor.length !== 16 && isNaN(valor.slice(-1))){
            setCnpj(cnpj)
        }
        else{
            // console.log(controleCnpj)
            // console.log(valor.length)
            console.log(`valor.length: ${valor.length}`)
            if (valor.length < 2){
                setCnpj(valor)
                setControleCnpj(0)
            }
            else if(valor.length === 2 && controleCnpj < 2) {
                setCnpj(valor + '.')
                setControleCnpj(2)
            }
            else if(valor.length === 3 && valor[valor.length-1] !== '.'){
                setCnpj(cnpj + '.' + valor[valor.length-1])
                setControleCnpj(2)
            }
            else if (valor.length > 3 && valor[2] !== '.'){

                setCnpj('')
                toast.warning('Siga o padrão: XX.XXX.XXX/XXXX-XX para o CNPJ', {position: 'bottom-left', autoClose: 2500, className: 'flash-login', hideProgressBar: true, pauseOnHover: false, theme: "dark"})
            }
            else if (valor.length<6){
                setCnpj(valor)
                setControleCnpj(2)
            }
            else if(valor.length === 6 && controleCnpj < 6) {
                setCnpj(valor + '.')
                setControleCnpj(6)
            }
            else if(valor.length === 7 && valor[valor.length-1] !== '.'){
                setCnpj(cnpj + '.' + valor[valor.length-1])
                setControleCnpj(6)
            }
            else if (valor.length < 10){
                setCnpj(valor)
                setControleCnpj(6)
            }
            else if(valor.length === 10 && controleCnpj < 10) {
                setCnpj(valor + '/')
                setControleCnpj(10)
            }
            else if(valor.length === 11 && valor[valor.length-1] !== '/'){
                setCnpj(cnpj + '/' + valor[valor.length-1])
                setControleCnpj(10)
            }
            else if (valor.length < 15){
                setCnpj(valor)
                setControleCnpj(10)
            }
            else if(valor.length === 15 && controleCnpj < 15) {
                setCnpj(valor + '-')
                setControleCnpj(15)
            }
            else if(valor.length === 16 && valor[valor.length-1] !== '-'){
                setCnpj(cnpj + '-' + valor[valor.length-1])
                setControleCnpj(15)
            }
            else {
                setCnpj(valor)
            }
        }
    }

    function carretFim(ref:any){
        ref.current.setSelectionRange(-1, -1)
    }

    function impedeSeta(evento:any){
        if(evento.keyCode === 37 || evento.keyCode === 39){
            evento.preventDefault();
        }
    }

    //=================== Tratamentos de Preço Unitário ===================
    function trataPrecoUnitario(evento: any) {
        let valor = evento.target.value
        if (isNaN(valor.slice(-1)) && unidade !== '' && valor.slice(-1) !== '.' && valor.slice(-1) !== ',') {
            setPrecoUnitario(precoUnitario)
        }
        else {
            if (!temVirgula && (valor.slice(-1) === ',' || valor.slice(-1) === '.')) {
                setTemVirgula(true)
            }
            if (temVirgula && (valor.slice(-1) === ',' || valor.slice(-1) === '.')
                && valor.length > precoUnitario.length) {
                setPrecoUnitario(precoUnitario)
            }
            else if (temVirgula && (precoUnitario.slice(-1) === ',' || precoUnitario.slice(-1) === '.')
                && valor.length < precoUnitario.length) {
                setPrecoUnitario(valor)
                setTemVirgula(false)
            }
            else { setPrecoUnitario(valor) }
        }
    }

    function blurPrecoUnitario(evento: any) {
        let valor = evento.target.value

        if (unidade !== '') {
            if (valor[0] !== 'R' && valor[0] !== '$' && valor.slice(-1) !== 't' && valor.slice(-1) !== 'g'
                && valor.slice(-1) !== '/' && valor.slice(-1) !== 'k' && valor.slice(-1) !== ' ' && valor.slice(-1) !== '') {
                valor = valor.replace(',', '.')
                setPrecoUnitario('R$' + valor + unidade)
            }
            else if (valor.slice(-1) !== 'g' && valor.slice(-1) !== 't' && valor[0] !== 'R') {
                toast.error('Preço unitário deve ser condizente com a unidade selecionada.', {
                    position: 'bottom-left',
                    autoClose: 2500, className: 'flash', hideProgressBar: true, pauseOnHover: false, theme: "dark"
                })
                setPrecoUnitario('')
            }
            else {
                setPrecoUnitario(precoUnitario)
            }
        }
        else {
            if (precoUnitario !== '') {
                toast.error('Selecione a unidade antes.', {
                    position: 'bottom-left', autoClose: 2500,
                    className: 'flash', hideProgressBar: true, pauseOnHover: false, theme: "dark"
                })
            }
            setPrecoUnitario('')

        }
        setTemVirgula(false)

    }

    function selectPrecoUnitario(evento: any) {
        let valor = evento.target.value
        if (valor[0] === 'R' && valor.slice(-1) === 't') {
            console.log(valor.slice(2, -2))
            setPrecoUnitario(valor.slice(2, -2))
        }
        else if (valor[0] === 'R' && valor.slice(-1) === 'g') {
            console.log(valor.slice(2, -2))
            setPrecoUnitario(valor.slice(2, -3))
        }
        if (valor.includes('.') || valor.includes(',')) {
            setTemVirgula(true)
        }
    }


    //=================== Tratamentos de Quantidade ===================

    function trataQuantidade(evento: any) {
        let valor = evento.target.value
        if (isNaN(valor.slice(-1)) && unidade !== '' && valor.slice(-1) !== '.' && valor.slice(-1) !== ',') {
            setQuantidade(quantidade)
        }
        else {
            if (!temVirgula && (valor.slice(-1) === '.' || valor.slice(-1) === ',')) {
                setTemVirgula(true)
            }
            if (temVirgula && (valor.slice(-1) === '.' || valor.slice(-1) === ',')
                && valor.length > quantidade.length) {
                console.log(`Valor Tamanho: ${valor.length} | Quantidade Tamanho: ${quantidade.length}`)
                setQuantidade(quantidade)
            }
            else if (temVirgula && (quantidade.slice(-1) === ',' || quantidade.slice(-1) === '.')
                && valor.length < quantidade.length) {
                setQuantidade(valor)
                setTemVirgula(false)
            }
            else { setQuantidade(valor) }
        }
    }

    function blurQuantidade(evento: any) {
        let valor = evento.target.value
        if (unidade !== '') {
            if (valor.slice(-1) !== 't' && valor.slice(-1) !== 'g'
                && valor.slice(-1) !== 'k' && valor.slice(-1) !== '' && valor.slice(-1) !== ' ') {
                valor = valor.replace(',', '.')
                setQuantidade(valor + ' ' + unidade.slice(1))
            }
            else if (valor.slice(-1) !== 't' && valor.slice(-1) !== 'g') {
                toast.error('Quantidade deve ser condizente com a unidade do produto.', {
                    position: 'bottom-left',
                    autoClose: 2500, className: 'flash', hideProgressBar: true, pauseOnHover: false, theme: "dark"
                })
                setQuantidade('')
            }
            else {
                setQuantidade(quantidade)
            }
        }
        else {
            if (quantidade !== '') {
                toast.error('Selecione a unidade antes.', {
                    position: 'bottom-left', autoClose: 2500,
                    className: 'flash', hideProgressBar: true, pauseOnHover: false, theme: "dark"
                })
            }
            setQuantidade('')
        }
        setTemVirgula(false)
    }

    function selectQuantidade(evento: any) {
        let valor = evento.target.value
        if (valor.slice(-1) === 't') {
            setQuantidade(valor.slice(0, -2))
        }
        else if (valor.slice(-1) === 'g') {
            setQuantidade(valor.slice(0, -3))
        }
        if (valor.includes('.') || valor.includes(',')) {
            setTemVirgula(true)
        }
    }

    // ====================== Botões ======================

    async function confirmaVoltaListagem() {
        if (produto !== '' && dataEntrega !== '' && cnpj !== '' && precoUnitario !== '' &&
            quantidade !== '' && precoTotal !== '' && tipoFrete !== '' && transportadora !== '' && condicaoPagamento) {
            const post = {
                id, unidade, produto, dataEmissao, dataEntrega, cnpj, precoUnitario,
                quantidade, precoTotal, tipoFrete, transportadora, condicaoPagamento
            }
            navegate('/listaPedidos')
            await api.post('/postNota', { post })

        }
        else {
            toast.error('Preencha todos os campos', {
                position: 'bottom-left', autoClose: 2500,
                className: 'flash', hideProgressBar: true, pauseOnHover: false, theme: "dark"
            })
        }

    }

    async function editarVoltaListagem() {
        if (produto !== '' && dataEntrega !== '' && cnpj !== '' && precoUnitario !== '' &&
            quantidade !== '' && precoTotal !== '' && tipoFrete !== '' && transportadora !== '' && condicaoPagamento) {
            const post = {
                id, unidade, produto, dataEmissao, dataEntrega, cnpj, precoUnitario,
                quantidade, precoTotal, tipoFrete, transportadora, condicaoPagamento, nfCodigo
            }
            navegate('/listaPedidos')
            await api.post('/updateNota', { post })

        }
        else {
            toast.error('Preencha todos os campos', {
                position: 'bottom-left', autoClose: 2500,
                className: 'flash', hideProgressBar: true, pauseOnHover: false, theme: "dark"
            })
        }

    }

    async function confirmaContinua() {
        if (produto !== '' && dataEntrega !== '' && cnpj !== '' && precoUnitario !== '' &&
            quantidade !== '' && precoTotal !== '' && tipoFrete !== '' &&
            transportadora !== '' && condicaoPagamento) {
            const post = {
                id, unidade, produto, dataEmissao, dataEntrega, cnpj, precoUnitario,
                quantidade, precoTotal, tipoFrete, transportadora, condicaoPagamento
            }
            await api.post('/postNota', { post }).then((response) => { navegate(`/analiseQuant/${id}`) })
        }
        else {
            toast.error('Preencha todos os campos', {
                position: 'bottom-left', autoClose: 2500,
                className: 'flash', hideProgressBar: true, pauseOnHover: false, theme: "dark"
            })
        }

    }
    async function veStatus() {
        await api.post('/confereStatus', { id: id, acessando: 'Nota Fiscal' }).then((resposta) => {
            let dado = resposta.data
            console.log(resposta)

            if (dado.status === 'Primeira vez') {
                setMudanca('Primeira vez')
            }
            else if (dado.status === 'Revisão') {
                setMudanca('Revisão')
                setCnpj(dado.nf_cnpj)
                setProduto(dado.nf_produto_descricao)
                setTransportadora(dado.nf_transportadora)
                setCondicaoPagamento(dado.nf_condicao_pagamento)
                setQuantidade(dado.nf_produto_massa)
                setPrecoUnitario(dado.nf_valor_unidade)
                setPrecoTotal(dado.nf_valor_total)
                setDataEntrega(dado.nf_data_entrega.slice(0, 10))
                setDataEmissao(dado.nf_data_emissao.slice(0, 10))
                setTipoFrete(dado.nf_tipo_frete)
                setNfCodigo(dado.nf_codigo)

                setUnidade(dado.nf_unidade)

            }
            else if (dado.status === 'Edição') {
                setMudanca('Edição')
                setCnpj(dado.nf_cnpj)
                setProduto(dado.nf_produto_descricao)
                setTransportadora(dado.nf_transportadora)
                setCondicaoPagamento(dado.nf_condicao_pagamento)
                setQuantidade(dado.nf_produto_massa)
                setPrecoUnitario(dado.nf_valor_unidade)
                setPrecoTotal(dado.nf_valor_total)
                setDataEntrega(dado.nf_data_entrega.slice(0, 10))
                setDataEmissao(dado.nf_data_emissao.slice(0, 10))
                setTipoFrete(dado.nf_tipo_frete)
                setNfCodigo(dado.nf_codigo)
                setUnidade(dado.nf_unidade)

            }
            else {
                navegate('/listaPedidos')
            }
        });

    }

    function cancelaVoltaListagem() {
        navegate('/listaPedidos')
    }

    //====================== Botões de mudança de fase ======================

    function irQuantitativa() {
        navegate(`/analiseQuant/${id}`)
    }
    function irCadastroPedido() {
        navegate(`/cadastroPedido/${id}`)
    }

    // ====================== Use Effect ======================

    useEffect(() => {
        async function veLogado() {
            let resultado = await verificaLogado()
            //setLogado(resultado)
            if (!resultado.logado) {
                navegate('/')
            }
        }
        veLogado()



        if (precoUnitario !== '' && quantidade !== '') {
            let preco
            let quant
            if (precoUnitario.slice(-1) === 't') {
                preco = precoUnitario.slice(2, -2)
                quant = quantidade.slice(0, -2)
                if (preco.includes(',')) { preco = preco.replace(',', '.') }
                if (quant.includes(',')) { quant = quant.replace(',', '.') }
                preco = parseFloat(preco)
                quant = parseFloat(quant)
            }
            else {
                preco = precoUnitario.slice(2, -3)
                quant = quantidade.slice(0, -3)
                if (preco.includes(',')) { preco = preco.replace(',', '.') }
                if (quant.includes(',')) { quant = quant.replace(',', '.') }
                preco = parseFloat(preco)
                quant = parseFloat(quant)
            }
            if (!isNaN(preco * quant)) {
                setPrecoTotal(`R$ ${preco * quant}`)
            }

        }
        if (((precoUnitario.slice(-1) === 'g' || quantidade.slice(-1) === 'g') && unidade === "t")) {
            setQuantidade(quantidade.replace('kg', 't'))
            setPrecoUnitario(precoUnitario.replace('kg', 't'))
        }
        if (((precoUnitario.slice(-1) === 't' || quantidade.slice(-1) === 't') && unidade === "kg")) {
            setQuantidade(quantidade.replace('t', 'kg'))
            setPrecoUnitario(precoUnitario.replace('t', 'kg'))
        }
        console.log(`AAAAAAOOOOBA ${unidade}`)
    }, [precoUnitario, quantidade, unidade])

    useEffect(() => {
        veStatus()
    }, [])

    if (mudanca !== 'Revisão') {
        return (

            <>
                <NavBar />
                <div className="mainContent">
                    <div className="botoesNavegacao">
                        <h1 className="recebimentoTitulo">RECEBIMENTO DO PEDIDO: {id}</h1>
                   </div>
                    <h4 className="txtAlg">Insira a nota fiscal</h4>
                </div>

                <div className="divFornecedor">
                    <form className="responsividadeforms">
                    <button type='button' onClick={irCadastroPedido} className="botaoteste4">
                            <img src={teste} alt="" className="testeaEsquerda" />Cadastro dos Pedidos</button>
                            {mudanca === 'Edição' &&
                        <button type='button' onClick={irQuantitativa} className="botaoteste4esquerda">Análise Quantitativa
                            <img src={teste} alt="" className="testeaDireita" /></button>
                        }
                        <div className="grid-container poscentralized">
                            <div className="box">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>CNPJ :</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><input className="input_form" type="text" id="cnpj" name="cnpj" placeholder="00.000.000/0000-00" required
                                                value={cnpj}
                                                minLength={18}
                                                maxLength={18}
                                                ref={cnpjRef}
                                                onChange={trataCnpj}
                                                onClick={() => carretFim(cnpjRef)}
                                                onKeyDown={impedeSeta}/>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="box">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Data de emissão :</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><input className="input_form" type="date" max="9999-12-31" value={dataEmissao}
                                                onChange={(e) => { setDataEmissao(e.target.value) }} required />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="box">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Data de entrega :</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><input className="input_form" type="date" max="9999-12-31" value={dataEntrega}
                                                onChange={(e) => { setDataEntrega(e.target.value) }} required />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            
                        </div>
                        <div className="grid-container poscentralized">
                            <div className="box">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Produto :</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><input className="input_form" type="text" value={produto}
                                                onChange={(e) => { setProduto(e.target.value) }} required />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="box">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Unidade :</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                {mudanca === 'Edição' &&
                                                    <select className="input_form" value={unidade}
                                                        onChange={(e) => { setUnidade(e.target.value) }} required>
                                                        {unidade === '/kg' &&
                                                            <option value='/kg'>Quilogramas(kg)</option>
                                                        }
                                                        {unidade === '/t' &&
                                                            <option value='/t'>Toneladas(t)</option>
                                                        }
                                                        <option value="/t">Toneladas(t)</option>
                                                        <option value="/kg">Quilogramas(kg)</option>
                                                    </select>
                                                }
                                                {mudanca === 'Primeira vez' &&
                                                    <select className="input_form" value={unidade}
                                                        onChange={(e) => { setUnidade(e.target.value) }} required>
                                                        <option value=""></option>
                                                        <option value="/t">Toneladas(t)</option>
                                                        <option value="/kg">Quilogramas(kg)</option>
                                                    </select>
                                                }
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div> 
                        </div>

                        <div className="grid-container poscentralized">
                            <div className="box">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Quantidade :</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><input className="input_form" type="text" value={quantidade}
                                                onChange={trataQuantidade}
                                                onBlur={blurQuantidade}
                                                onSelect={selectQuantidade} required />
                                                <p></p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="box">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Preço Unitário :</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><input className="input_form" type="text"
                                                value={precoUnitario}
                                                onChange={trataPrecoUnitario}
                                                onBlur={blurPrecoUnitario}
                                                onSelect={selectPrecoUnitario} required />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="box">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Preço Total :</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><input className="input_form" type="text" value={precoTotal}
                                                onChange={(e) => { setPrecoTotal(e.target.value) }} required readOnly />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>  
                        </div>

                        <div className="grid-container poscentralized">
                            <div className="box">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Tipo de frete :</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                {mudanca === 'Edição' &&
                                                    <select className="input_form" id="frete" name="frete" required
                                                        value={tipoFrete}
                                                        onChange={(e) => { setTipoFrete(e.target.value) }}>
                                                        <option value={tipoFrete}>{tipoFrete}</option>
                                                        <option value="Barco">Barco</option>
                                                        <option value="Trem">Trem</option>
                                                        <option value="Caminhão">Caminhão</option>
                                                        <option value="Avião">Avião</option>
                                                    </select>
                                                }
                                                {mudanca === 'Primeira vez' &&
                                                    <select className="input_form" id="frete" name="frete" required
                                                        value={tipoFrete}
                                                        onChange={(e) => { setTipoFrete(e.target.value) }}>
                                                        <option value=""></option>
                                                        <option value="Barco">Barco</option>
                                                        <option value="Trem">Trem</option>
                                                        <option value="Caminhão">Caminhão</option>
                                                        <option value="Avião">Avião</option>
                                                    </select>
                                                }

                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="box">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Transportadora :</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><input className="input_form" type="text" value={transportadora}
                                                onChange={(e) => { setTransportadora(e.target.value) }} required />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="box">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Pagamento :</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                {mudanca === 'Edição' &&
                                                    <select className="input_form" name="condicaoPagamento" id="condicaoPagamento" required
                                                        value={condicaoPagamento}
                                                        onChange={(e) => { setCondicaoPagamento(e.target.value) }}>
                                                        <option value={condicaoPagamento}>{condicaoPagamento}</option>
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
                                                }
                                                {mudanca === 'Primeira vez' &&
                                                    <select className="input_form" name="condicaoPagamento" id="condicaoPagamento" required
                                                        value={condicaoPagamento}
                                                        onChange={(e) => { setCondicaoPagamento(e.target.value) }}>
                                                        <option value=''></option>
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
                                                }
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {mudanca === 'Primeira vez' &&
                            <>
                                <button type="button" onClick={cancelaVoltaListagem} className="cancel_button3">Cancelar</button>
                                <button type="button" onClick={confirmaContinua} className="confirm_button">Confirmar</button>
                            </>
                        }
                        {mudanca === 'Edição' &&
                            <>
                                <button type="button" onClick={cancelaVoltaListagem} className="cancel_button3">Cancelar</button>
                                <button type="button" onClick={editarVoltaListagem} className="confirm_button">Editar</button>
                            </>
                        }
                    </form>
                </div>
            </>
        )
    }
    else {
        return (

            <>
                <NavBar />

                <div className="mainContent">
                    <div className="botoesNavegacao">
                        <div className="blocoInvisivel2" />
                        <h1 className="mainTitle">RECEBIMENTO DO PEDIDO: {id}</h1>

                    </div>
                    <h3 className="txtAlg">Insira a nota fiscal</h3>
                </div>

                <div className="divFornecedor">
                    <form className="responsividadeforms">
                    <button type='button' onClick={irCadastroPedido} className="botaoteste4">
                            <img src={teste} alt="" className="testeaEsquerda" />Cadastro dos Pedidos</button>                    
                    <button type='button' onClick={irQuantitativa} className="botaoteste4esquerda">Análise Qualitativa
                        <img src={teste} alt="" className="testeaDireita" /></button>
                        <div className="grid-container poscentralized">
                            <div className="box">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>CNPJ :</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><input className="input_form" type="text" id="cnpj" name="cnpj" placeholder="00.000.000/0000-00" required
                                                value={cnpj}
                                                readOnly/>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="box">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Data de emissão :</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><input className="input_form" type="date" max="9999-12-31" value={dataEmissao}
                                                onChange={(e) => { setDataEmissao(e.target.value) }} required readOnly />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="box">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Data de entrega :</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><input className="input_form" type="date" max="9999-12-31" value={dataEntrega}
                                                onChange={(e) => { setDataEntrega(e.target.value) }} required readOnly />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="grid-container poscentralized">
                        <div className="box">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Produto :</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><input className="input_form" type="text" value={produto}
                                                onChange={(e) => { setProduto(e.target.value) }} required readOnly />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="box">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Unidade :</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><select className="input_form" value={unidade}
                                                onChange={(e) => { setUnidade(e.target.value) }} disabled required>
                                                <option value={unidade} selected>{unidade}</option>

                                            </select>
                                                <p></p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="grid-container-5 poscentralized">
                            <div className="box">

                                <table>
                                    <thead>
                                        <tr>
                                            <th>Quantidade :</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><input className="input_form" type="text"
                                                value={quantidade}
                                                onChange={trataQuantidade}
                                                onBlur={blurQuantidade}
                                                onSelect={selectQuantidade} required readOnly />
                                                <p></p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="box">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Preço Unitário :</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><input className="input_form" type="text"
                                                value={precoUnitario}
                                                onChange={trataPrecoUnitario}
                                                onBlur={blurPrecoUnitario}
                                                onSelect={selectPrecoUnitario} required readOnly />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="box">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Preço Total :</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><input className="input_form" type="text" value={precoTotal}
                                                onChange={(e) => { setPrecoTotal(e.target.value) }} required readOnly />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                        <div className="grid-container poscentralized">
                            <div className="box">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Tipo de frete :</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><select className="input_form" id="frete" name="frete" required
                                                value={tipoFrete}
                                                onChange={(e) => { setTipoFrete(e.target.value) }} disabled>
                                                <option value={tipoFrete} selected>{tipoFrete}</option>
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
                                            <th>Transportadora :</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><input className="input_form" type="text" value={transportadora}
                                                onChange={(e) => { setTransportadora(e.target.value) }} required readOnly />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="box">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Pagamento :</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><select className="input_form" name="condicaoPagamento" id="condicaoPagamento" required
                                                value={condicaoPagamento}
                                                onChange={(e) => { setCondicaoPagamento(e.target.value) }} disabled>
                                                <option value={condicaoPagamento} selected>{condicaoPagamento}</option>
                                            </select>

                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <button type="button" onClick={cancelaVoltaListagem} className="cancel_button">Voltar</button>
                    </form>
                </div>
            </>
        )
    }

}

export default RecebimentoPedido