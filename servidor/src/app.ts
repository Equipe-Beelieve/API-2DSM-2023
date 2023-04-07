import express from "express";
import bodyParser, { json } from "body-parser";
import bancoDados from "./bancoDados.js"
import Pedido from "./Pedido.js"
import Endereco from "./Endereco.js";
import Fornecedor from "./Fornecedor.js";
import Usuario from "./Usuario.js";
import cors from 'cors'

const PORT = 8080;
const app = express();
app.set('view engine', 'ejs')
app.use(cors())
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true }));
app.use(express.static('public'));


const bd = new bancoDados() //criando uma instância do bd para utilizar os métodos


//========================= Listagem de Pedidos =========================

app.get('/listaPedido', async (req,res) =>{
    let tabelaPedidos = await bd.pegarListaPedidos()
    res.send({tabelaPedidos})
    console.log(tabelaPedidos)
})

//========================= Cadastro de Pedidos =========================
app.get('/cadastroPedido', async (req, res) => {
    let razaoSocial = await bd.pegarRazaoSocial()
    res.send({razaoSocial});
})

app.post('/postCadastroPedido', async (req,res) => {
    let pedido = new Pedido(req.body.post.produto, req.body.post.dataPedido, req.body.post.dataEntrega,
        req.body.post.razaoSocial, req.body.post.precoUnitario, req.body.post.quantidade,
        req.body.post.precoTotal, req.body.post.frete, req.body.post.transportadora, req.body.post.condicaoPagamento)
    await bd.inserirPedido(pedido) //método da clase bancoDados para inserir na tabela pedido

});

//========================= Listagem de Fornecedores =========================
app.get("/listaFornecedores", async (req, res) => {
    let tabelaFornecedores = await bd.pegarListaFornecedores()
    const jsonFornecedores = JSON.stringify(tabelaFornecedores)
    res.send({jsonFornecedores})
    console.log(jsonFornecedores)
})

//========================= Cadastro de Fornecedores =========================
// app.get('/cadastroFornecedor', (req, res) => {
//     res.render('cadastroFornecedor')
// })
app.post('/cadastroFornecedor', async (req, res) => {
    let {cnpj, cep, estado, cidade, bairro, ruaAvenida, numero, razaoSocial, nomeFantasia} = req.body.post
    let endereco = new Endereco(cep, estado, cidade, bairro, ruaAvenida, numero)
    let fornecedor = new Fornecedor(cnpj, endereco, razaoSocial, nomeFantasia)
    console.log(req.body.post)
    console.log(cnpj, cep, estado, cidade, bairro, ruaAvenida, numero, razaoSocial, nomeFantasia)
    await bd.inserirFornecedor(fornecedor, endereco)
    
})   


//========================= Listagem de Usuarios =========================
app.get('/usuariosCadastrados', async (req, res) => {
    let tabelaUsuario = await bd.listarUsuario()
    res.send({tabela:tabelaUsuario});
});



//========================= Cadastro de Usuarios =========================
app.get('/cadastroUsuario', (req, res) => {
    res.render('cadastroUsuario');
});

app.post('/postCadastroUsuario', async (req,res) => {
    let dadosUsuario = Object.values(req.body) //armazenei só os valores do que veio do formulário, na ordem em que eles estão lá
    
    let usuario = new Usuario(...dadosUsuario as [string, string, string, string])
    
    await bd.inserirUsuario(usuario) //método da clase bancoDados para inserir na tabela pedido
    let tabelaPedido = await bd.pegarTabela('usuario') //método para consultar a tabela inteira
    console.log(tabelaPedido)
    res.redirect('/')

    console.log(dadosUsuario)
});



app.listen(8080, () => {
    console.log(`servidor rodando em http://localhost:${PORT}`);
});

//npm install - instala as dependências
//npx tsc - compilar o código 
//ts-node-esm - executar arquivos .ts