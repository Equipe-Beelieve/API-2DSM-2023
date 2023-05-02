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
    let {produto, dataPedido, dataEntrega, razaoSocial, precoUnitario, 
        quantidade, precoTotal, frete, transportadora, condicaoPagamento} = req.body.post
    let pedido = new Pedido(produto, dataPedido, dataEntrega, razaoSocial, 
        precoUnitario, quantidade, precoTotal, frete, transportadora, condicaoPagamento)
    await bd.inserirPedido(pedido) //método da clase bancoDados para inserir na tabela pedido

});

//========================= Cadastro de Fornecedores =========================
app.post('/cadastroFornecedor', async (req, res) => {
    let {cnpj, cep, estado, cidade, bairro, ruaAvenida, numero, razaoSocial, nomeFantasia} = req.body.post
    let endereco = new Endereco(cep, estado, cidade, bairro, ruaAvenida, numero)
    let fornecedor = new Fornecedor(cnpj, endereco, razaoSocial, nomeFantasia)
    await bd.inserirFornecedor(fornecedor, endereco)
})

//========================= Cadastro de Usuarios =========================
app.post('/cadastroUsuario', async (req,res) => {
    let {nome, senha,funcao, login} = req.body.post
    console.log(`nome: ${nome} | senha: ${senha} | funcao: ${funcao} | login: ${login}`)
    let usuario = new Usuario(nome, senha,funcao, login)
    await bd.inserirUsuario(usuario) 
});

//========================= Cadastro de Produtos =========================
app.post('/cadastroProduto', async (req, res) => {
    let {descricao, unidadeMedida} = req.body.post
    let produto = new Produto(descricao, unidadeMedida)
    await bd.inserirProduto(produto)
})


//================================== Rotas de Listagem ==================================
//========================= Listagem de Pedidos =========================
app.get('/listaPedido', async (req,res) =>{
    let tabelaPedidos = await bd.pegarListaPedidos()
    let funcao = req.session.funcao
    res.send({tabelaPedidos, funcao})
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


//================================== Rotas de etapas de recebimento ==================================
//========================= Inserção da nota fiscal =========================
app.post('/postNota', async (req, res) => {
    let {id, produto,  dataEmissao, dataEntrega, razaoSocial, precoUnitario, 
        quantidade, precoTotal, tipoFrete, transportadora, condicaoPagamento} = req.body.post
    let codigoFornecedor = await bd.pegarCodigo('for_codigo', 'fornecedor', 'for_razao_social', razaoSocial)
    let nf = new NotaFiscal(produto, dataEmissao, dataEntrega, razaoSocial, precoUnitario, 
        quantidade, precoTotal, tipoFrete, transportadora, condicaoPagamento, codigoFornecedor, id)
    await bd.inserirNF(nf)
})

//========================= Inserção da análise qualitativa =========================
app.post('/postAnaliseQlt', async (req, res) => {
    let {id, produto,  dataEmissao, dataEntrega, razaoSocial, precoUnitario, 
        quantidade, precoTotal, tipoFrete, transportadora, condicaoPagamento} = req.body.post
    let codigoFornecedor = await bd.pegarCodigo('for_codigo', 'fornecedor', 'for_razao_social', razaoSocial)
    let nf = new NotaFiscal(produto, dataEmissao, dataEntrega, razaoSocial, precoUnitario, 
        quantidade, precoTotal, tipoFrete, transportadora, condicaoPagamento, codigoFornecedor, id)
    await bd.inserirNF(nf)
})

app.listen(8080, () => {
    console.log(`servidor rodando em http://localhost:8080`);
});
