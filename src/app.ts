import express from "express";
import bodyParser from "body-parser";
import bancoDados from "./bancoDados.js"
import Pedido from "./Pedido.js"
import Endereco from "./Endereco.js";
import Fornecedor from "./Fornecedor.js";
import Usuario from "./Usuario.js";

const PORT = 8080;
const app = express();
app.set('view engine', 'ejs')
// app.set('views', '../views')
app.use(bodyParser.urlencoded({extended: true }));
app.use(express.static('public'));


const bd = new bancoDados() //criando uma instância do bd para utilizar os métodos


//========================= Listagem de Pedidos =========================

app.get('/', async (req,res) =>{
    let tabelaPedidos = await bd.pegarListaPedidos()
    res.render('pedidosCadastrados', {tabela:tabelaPedidos})
})

//========================= Cadastro de Pedidos =========================
app.get('/cadastroPedido', (req, res) => {
    res.render('cadastroPedido');
});

app.post('/postCadastroPedido', async (req,res) => {
    let pedido = new Pedido(req.body.produto, req.body.dataPedido, req.body.dataEntrega,
        req.body.razaoSocial, req.body.precoUnitario, req.body.quantidade,
        req.body.precoTotal, req.body.frete, req.body.transportadora, req.body.condicaoPagamento)
    
    await bd.inserirPedido(pedido) //método da clase bancoDados para inserir na tabela pedido
    res.redirect('/')
});

//========================= Listagem de Fornecedores =========================
app.get("/fornecedores", async (req, res) => {
    let tabelaFornecedores = await bd.listarFornecedores()
    res.render('fornecedoresCadastrados', {tabela:tabelaFornecedores})
})

//========================= Cadastro de Fornecedores =========================
app.get('/cadastroFornecedor', (req, res) => {
    res.render('cadastroFornecedor')
})
app.post('/cadastroFornecedor', async (req, res) => {
    let {for_cnpj, end_cep, end_estado, end_cidade, end_bairro, end_rua_avenida, end_numero, for_razao_social, for_nome_fantasia} = req.body
    let endereco = new Endereco(end_cep, end_estado, end_cidade, end_bairro, end_rua_avenida, end_numero)
    let fornecedor = new Fornecedor(for_cnpj, endereco, for_razao_social, for_nome_fantasia)

    await bd.inserirFornecedor(fornecedor, endereco)
    res.redirect('/cadastroFornecedor')
})   


//========================= Listagem de Usuarios =========================
app.get('/usuariosCadastrados', async (req, res) => {
    let tabelaUsuario = await bd.listarUsuario()
    res.render('usuariosCadastrados', {tabela:tabelaUsuario});
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