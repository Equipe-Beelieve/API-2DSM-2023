import express from "express";
import bodyParser, { json } from "body-parser";
import bancoDados from "./bancoDados.js"
import Pedido from "./Pedido.js"
import Endereco from "./Endereco.js";
import Fornecedor from "./Fornecedor.js";
import Usuario from "./Usuario.js";
import cors from 'cors'
import session from 'express-session';
import Produto from "./Produto.js";
import NotaFiscal from "./NotaFiscal.js";
import AnaliseQualitativa from "./Analisequalitativa.js";
import Regra from "./RegraRecebimento.js";
import RegrasAnalises from "./RegrasAnalises.js";

declare module 'express-session' {
    export interface SessionData {
      login: string,
      senha: string ,
      funcao: string
    }
  }
  
const app = express();
app.use(session({
    secret: 'rerbegvefvecvfertverfvfvegbfererbgfvebr',
    resave: false,
    saveUninitialized: true,
    
    cookie:{
        sameSite:"lax",
        httpOnly:true
    }
}))
app.set('view engine', 'ejs')
app.use(cors({
    origin:'http://localhost:3000',
    credentials:true
}))
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true }));
app.use(express.static('public'));




const bd = new bancoDados() //criando uma instância do bd para utilizar os métodos

//================================== Rotas de Funções ==================================
//========================= Conferir sessão =========================
app.get('/confereLogado', async(req,res)=>{
    //console.log(req.session.funcao)
    if (req.session.funcao){
        res.send({logado:'true', funcao:req.session.funcao})
    }
    else{
        res.send('false')
    }
})

//========================= Autenticação de login =========================
app.post('/login', async(req,res)=>{
    let login = req.body
    let usuario = await bd.dadosUsuario(login)
    if (usuario){
        req.session.senha = login.senha
        req.session.login = login.login
        req.session.funcao = usuario.us_funcao
        
        res.send('true')
    } 
    else {
        console.log('naodeu')
        res.send('false')
    }
    // let usuario = bd.dadosUsuario(login)

    // if (usuario != undefined){
    //     req.session.user = usuario
    //     console.log(req.session.user)
    //     res.send(true)
    // }
    // else{
    //     res.send(false)
    // }
})

//========================= Loggout =========================
app.get('/loggout', async (req,res) =>{
    
    req.session.destroy((err)=>{
        if (err){
            res.send(err)
        }
        else{
            res.send('Deslogado')
        }
    })
})

//========================= Logins existentes (evitar repetição) =========================
app.get('/pegarLogin', async (req, res) => {
    let logins = await bd.pegarLogin();
    // let loginsSimples = logins.map((login: Record<string, string>) => login.us_login); // transformando a array de objetos em uma array simples
    res.send({logins});
});


//================================== Rotas de Cadastro ==================================
//========================= Cadastro de Pedidos =========================
app.get('/cadastroPedido', async (req, res) => {
    let razaoSocial = await bd.pegarRazaoSocial()
    let produtos = await bd.listarProdutos()
    res.send({razaoSocial, produtos});
})

app.post('/postCadastroPedido', async (req,res) => {
    let {produto, dataPedido, dataEntrega, razaoSocial, cnpj, precoUnitario, 
        quantidade, precoTotal, frete, transportadora, condicaoPagamento} = req.body.post
    let pedido = new Pedido(produto, dataPedido, dataEntrega, cnpj, 
        precoUnitario, quantidade, precoTotal, frete, transportadora, condicaoPagamento, razaoSocial)
    await bd.inserirPedido(pedido) //método da clase bancoDados para inserir na tabela pedido
    res.send('Foi')
});

app.post('/updatePedido', async (req,res) => {
    let {id, produto, dataPedido, dataEntrega, razaoSocial, cnpj, precoUnitario, quantidade, precoTotal, frete, transportadora, condicaoPagamento} = req.body.post
    let pedido = new Pedido(produto, dataPedido, dataEntrega, cnpj, precoUnitario, quantidade, precoTotal, frete, transportadora, condicaoPagamento, razaoSocial)
    let status = await bd.pegaStatus(id)
    let trocaUnidade = false
    let unidade = ''
    if (status !== 'Análise Quantitativa' && status !== 'A caminho'){
        let unidade = await bd.condereUnidade(id)
        console.log(unidade)
        if (unidade.slice(-1) !== quantidade.slice(-1)){
            trocaUnidade = true
        } 
        else{
            trocaUnidade = false
        }
    }
    await bd.updatePedido(pedido, id, trocaUnidade, unidade)
    res.send('Foi')
});

//========================= Cadastro de Fornecedores =========================
app.post('/cadastroFornecedor', async (req, res) => {
    let {cnpj, cep, estado, cidade, bairro, ruaAvenida, numero, razaoSocial, nomeFantasia} = req.body.post
    let endereco = new Endereco(cep, estado, cidade, bairro, ruaAvenida, numero)
    let fornecedor = new Fornecedor(cnpj, endereco, razaoSocial, nomeFantasia)
    await bd.inserirFornecedor(fornecedor, endereco)
    res.send('Foi')
})

//========================= Cadastro de Usuarios =========================
app.post('/cadastroUsuario', async (req,res) => {
    let {nome, senha,funcao, login} = req.body.post
    console.log(`nome: ${nome} | senha: ${senha} | funcao: ${funcao} | login: ${login}`)
    let usuario = new Usuario(nome, senha,funcao, login)
    await bd.inserirUsuario(usuario) 
    res.send('Foi')
});

//========================= Cadastro de Produtos =========================
app.post('/cadastroProduto', async (req, res) => {
    let regrasRecebimento = req.body.post.regras
    console.log('=========================================')
    console.log(req.body)
    console.log('=========================================')
    let descricao = req.body.post.descricao
    let unidadeMedida = req.body.post.unidadeMedida
    console.log(regrasRecebimento)
    let produto = new Produto(descricao, unidadeMedida)
    let codigoProduto = await bd.inserirProduto(produto)
    regrasRecebimento.forEach(async (regra:Regra) => {
        const tipoRegra = regra.tipo
        const descricaoRegra = regra.valor
        // const obrigatoriedade = regra.obrigatoriedade
        await bd.inserirRegrasRecebimento(tipoRegra,  descricaoRegra,  codigoProduto)
    });
    res.send('Foi')
    
})

//================================== Rotas de UPDATE ==================================
//========================= Update de Usuarios =========================
app.post('/resgataValoresUsuario',async (req, res) => {
    let id = req.body.id
    //console.log('id: ', id)
    let loginUsuario = req.session.login
    let usuario = await bd.pegaUsuario(id)
    let mesmoUsuario
    if(loginUsuario === usuario.us_login){
        mesmoUsuario = true
    }
    else{
        mesmoUsuario = false
    }
    let quantidadeFuncaoAdministrador = await bd.quantidadeFuncaoAdministrador()
    //console.log('user: ', usuario)
    res.status(201).send({usuario, quantidadeFuncaoAdministrador, mesmoUsuario})
})
app.post('/updateUsuario', async(req, res) => {
    console.log(req.body.post)
    let id = req.body.post.dados.idUsuario
    //console.log('id: ', id)
    let updateUsuario = req.body.post.dados
    let mesmoUsuario = req.body.post.mesmoUsuario
    let funcaoUsuario = await bd.pegaUsuario(id)
    let quantidadeFuncaoAdministrador = await bd.quantidadeFuncaoAdministrador()
    //console.log('pega usuario: ', funcaoUsuario)
    //console.log('us_funcao', funcaoUsuario['us_funcao'])
    //console.log('ad: ', quantidadeFuncaoAdministrador["COUNT('us_funcao')"])
    if(funcaoUsuario['us_funcao'] == 'Administrador'){
        if(mesmoUsuario){
            let usuario = new Usuario(updateUsuario.nome, updateUsuario.senha, updateUsuario.funcao, updateUsuario.login)
            await bd.updateUsuario(usuario, id)
            console.log(usuario, id)
            res.status(200).redirect('/loggout');
        } else {
            let usuario = new Usuario(updateUsuario.nome, updateUsuario.senha, updateUsuario.funcao, updateUsuario.login)
            await bd.updateUsuario(usuario, id)
            console.log('user adm: ', usuario, id)
            res.status(200).send(`Requisição recebida com sucesso! ${id}`);
        }
    }
     else{
        let usuario = new Usuario(updateUsuario.nome, updateUsuario.senha, updateUsuario.funcao, updateUsuario.login)
        await bd.updateUsuario(usuario, id)
        console.log(usuario, id)
        res.status(200).send(`Requisição recebida com sucesso! ${id}`);
    }
})

//========================= Update de Produto =========================
app.post('/resgataValoresProduto', async(req,res) => {
    let id = req.body.id
    let produto = await bd.pegaProduto(id)
    let existeProduto = await bd.confereProduto(id)
    let produtos = await bd.listarProdutoDescricao()
    //console.log(produtos)
    res.send({produto, existeProduto, produtos})
})

app.post('/updateProduto', async(req,res)=>{
    console.log(req.body)
    let id = req.body.id
    let regrasRecebimento = req.body.regras
    let descricao = req.body.descricao
    let unidadeMedida = req.body.unidadeMedida
    if(regrasRecebimento != '' && descricao != '' && unidadeMedida != ''){
        bd.updateProduto(id, descricao, unidadeMedida, regrasRecebimento)
        res.send('foi')
    } else{
        res.send('Não é permitido campos vazios')
    }
})

//========================= Update de Fornecedor =========================
app.post('/resgataValoresFornecedor', async (req, res) => {
    let id = req.body.id
    let existeFornecedor = await bd.confereFornecedor(id)
    console.log(existeFornecedor)
    res.send(existeFornecedor)
})

//================================== Rotas de Listagem ==================================
//========================= Listagem de Pedidos =========================
app.get('/listaPedido', async (req,res) =>{
    let tabelaPedidos = await bd.pegarListaPedidos()
    let funcao = req.session.funcao
    res.send({tabelaPedidos, funcao})
})

//========================= deleta Usuário =========================

app.post('/deletaUsuario', async (req, res) => {
    let id = req.body.id
    await bd.deletaUsuario(id)
    res.send('foi')
})

//========================= deleta Pedidos =========================

app.post('/deletePedido', async (req, res) => {
    let { post } = req.body;
    await bd.deletePedido(post);
    console.log(post);
  });

//========================= Deleta Fornecedor =========================
app.post('/deletaFornecedor', async (req, res) => {
    let id = req.body.id
    await bd.deletaFornecedor(id)
    res.send('foi')
})

//========================= Deleta Produto =========================
app.post('/deletaProduto', async (req, res) => {
    let id = req.body.id
    await bd.deletaProduto(id)
    res.send('foi')
})
  
//========================= Listagem de Fornecedores =========================
app.get("/listaFornecedores", async (req, res) => {
    let tabelaFornecedores = await bd.pegarListaFornecedores()
    res.send({tabelaFornecedores})
})

//========================= Listagem de Usuarios =========================
app.get('/listarUsuario', async (req, res) => {
    let tabelaUsuario = await bd.listarUsuario()
    res.send({tabelaUsuario});
});

//========================= Listagem de Produtos =========================
app.get('/listaProdutos', async (req, res) => {
    let tabelaProdutos = await bd.listarProdutos()
    res.send({tabelaProdutos})
})

app.get('/getDescricaoProdutos', async (req, res) => {
    let produtos = await bd.listarProdutoDescricao()
    console.log(produtos)
    res.send({produtos})
})


//================================== Rotas de etapas de recebimento ==================================

//========================= Confere Status ==============================
app.post('/confereStatus', async (req, res) =>{
    let {id, acessando} = req.body
    let status = await bd.pegaStatus(id)
    console.log(acessando)
    if (acessando === 'Nota Fiscal' && status !== 'A caminho' && status !== 'Finalizado' && status !== 'Aceito' && status !== 'Recusado'){
        let dados = await bd.pegaNf(id)
        dados['status'] = 'Edição'
        console.log(dados)
        res.send(dados)
    }
    else if (acessando === 'Relatório de Compras' && status !== 'Finalizado' && status !== 'Aceito' && status !== 'Recusado'){
        if(status !== undefined){
            let dados = await bd.pegaRelatorioCompras(id)
            let editar:string
            dados['status'] = 'Edição'
            if(status === 'A caminho'){
                editar = 'Permitir'
            }
            else{
                editar = 'Não permitir'
            }
            
            res.send({dados, editar})
        }
        else{
            res.send({status:"não permitir"})
        }
        
    }
    else if (acessando === 'Análise Quantitativa' && status !== 'Análise Quantitativa' && status !== 'Finalizado' && status !== 'Aceito' && status !== 'Recusado'){
        if(status !== 'A caminho'){
            let dados = await bd.pegaAnaliseQuantitativa(id)
            dados['status'] = 'Edição'
            res.send(dados)
        }
        else{
            res.send({status:"não permitir"})
        }
    }
    else if (acessando === 'Análise Qualitativa' && status !== 'Análise Qualitativa' && status !== 'Finalizado' && status !== 'Aceito' && status !== 'Recusado'){
        if (status !== 'A caminho' && status !== 'Análise Quantitativa'){
            let analises = await bd.pegaAnaliseQualitativa(id)
            let laudo = await bd.pegaLaudoNF(id)
            let dados = {
                analises: analises,
                laudo: laudo,
                status:'Edição'
            }
            res.send(dados)
        }
        else{
            res.send({status:"não permitir"})
        }
    }
    //else if (status !== 'Recusado' && status !== 'Aceito'){ DESCOMENTAR APÓS A IMPLEMENTAÇÃO DO RELATÓRIO FINAL
    else if (status !== 'Finalizado' && status !== 'Aceito' && status !== 'Recusado'){
        res.send({status:"Primeira vez"})
    }
    else {
        if(acessando === 'Relatório de Compras'){
            let dados = await bd.pegaRelatorioCompras(id)
            dados['status'] = 'Revisão'
            console.log(dados)
            res.send({dados, editar:'Não permitir'})
        }
        else if(acessando === 'Nota Fiscal'){
            let dados = await await bd.pegaNf(id)
            dados['status'] = 'Revisão'
            console.log(dados)
            res.send(dados)
        }
        else if(acessando === 'Análise Quantitativa'){
            let dados = await bd.pegaAnaliseQuantitativa(id)
            dados['status'] = 'Revisão'
            res.send(dados)
        }
        else{
            let analises = await bd.pegaAnaliseQualitativa(id)
            let laudo = await bd.pegaLaudoNF(id)
            let dados = {
                analises: analises,
                laudo: laudo,
                status:'Revisão'
            }
            res.send(dados)
        }
    }
})


//========================= Inserção da nota fiscal =========================
app.post('/postNota', async (req, res) => {
    let {id, unidade, produto,  dataEmissao, dataEntrega, cnpj, precoUnitario, quantidade, precoTotal, tipoFrete, transportadora, condicaoPagamento} = req.body.post
    console.log(`unidadePost: ${unidade}`)
    let codigoFornecedor = await bd.pegarCodigo('for_codigo', 'fornecedor', 'for_cnpj', cnpj)
    let nf = new NotaFiscal(produto, dataEmissao, dataEntrega, cnpj, precoUnitario, quantidade, precoTotal, tipoFrete, transportadora, condicaoPagamento, codigoFornecedor, unidade, id)
    await bd.inserirNF(nf)
    res.send('foi')
})

app.post('/updateNota', async (req,res) => {
    let {id, unidade, produto,  dataEmissao, dataEntrega, cnpj, precoUnitario, quantidade, precoTotal, tipoFrete, transportadora, condicaoPagamento} = req.body.post
    let codigoFornecedor = await bd.pegarCodigo('for_codigo', 'fornecedor', 'for_cnpj', cnpj)
    let nf = new NotaFiscal(produto, dataEmissao, dataEntrega, cnpj, precoUnitario, quantidade, precoTotal, tipoFrete, transportadora, condicaoPagamento, codigoFornecedor, unidade, id)
    await bd.updateNF(nf)
    res.send('Foi')

})
//========================= Análise Quantitativa =========================

app.post('/postQuantitativa', async (req, res) => {
    let {id, pesagem} = req.body.post
    console.log(req.body)
    await bd.inserirAnaliseQuantitativa(id, pesagem)
    res.send('Foi')
})

app.post('/updateQuantitativa', async (req, res) => {
    let {id, pesagem} = req.body.post
    await bd.updateQuantitativa(id, pesagem)
    res.send('Foi')
})

app.post('/confereUnidade', async (req, res)=>{
    let id = req.body.post
    let unidade = await bd.condereUnidade(id)
    res.send(unidade)
})

//========================= Análise Qualitativa =========================
app.get('/analiseQuali/:id', async (req, res) => {
    let id = req.params.id
    let pedido = await bd.pegaRelatorioCompras(id)
    let produto = pedido.pegarDescricao.toString()
    let codigoProduto = await bd.pegarCodigo('prod_codigo', 'produto', 'prod_descricao', produto)
    let regras = await bd.pegaRegraRecebimento(codigoProduto.toString())
    res.send(regras)
})

app.post('/postQualitativa', async (req, res) => {
    let {id, analises, laudo} = req.body.post
    //console.log(id)
    await bd.laudoNF(id, laudo)
    try {
        analises.forEach(async (analise:AnaliseQualitativa) => {
            await bd.inserirAnaliseQualitativa(id, analise)
            
        })
        await bd.mudaFinalizado(id)
        res.send('Foi')
    } catch (erro) {
        console.log(erro)
    } finally {
        await bd.desconectar()
    }
    //let analiseQualitativa = new AnaliseQualitativa(tipo, valor, avaria)
    //await bd.inserirAnaliseQualitativa(id, analiseQualitativa)
})

app.post('/updateQualitativa', async (req, res) =>{
    let {id, analises, laudo} = req.body.post
    console.log(analises)
    await bd.updateLaudoNF(id, laudo)
    try {
        analises.forEach(async (analise:AnaliseQualitativa) => {
            await bd.updateQualitativa(analise)
        })
        res.send('Foi')
    } catch (error) {
        console.log(error)
    } finally {
        ///await bd.desconectar()
    }
    
})


//======================= Relatório Final =======================

app.post('/relatorioFinal', async(req,res) => {
    let id = req.body.id
    let status = await bd.pegaStatus(id)
    let relatorioFinal = await bd.pegaDadosRelatorioFinal(id, status);
    if(status !== 'Recusado' && status !== 'Aceito'){
        relatorioFinal.RegrasAnalises.forEach(async(regra:RegrasAnalises)=>{
            await bd.guardaResultadoAnalise(regra, id)
        })
    }
    res.send(relatorioFinal)
})

app.post('/forcarAceite', async (req, res) => {
    let {status, id} = req.body
    await bd.mudaStatusFinal(status, id)
})

app.listen(8080, () => {
    console.log(`servidor rodando em http://localhost:8080`);
});
