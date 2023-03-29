import express from "express";
import bodyParser from "body-parser";
import bancoDados from "./bancoDados.js"
import Pedido from "./Pedido.js"
import Endereco from "./Endereco.js";
import Fornecedor from "./Fornecedor.js";

const PORT = 8080;
const app = express();
app.set('view engine', 'ejs')
// app.set('views', '../views')
app.use(bodyParser.urlencoded({extended: true }));
app.use(express.static('public'));


const bd = new bancoDados() //criando uma instância do bd para utilizar os métodos


//========================= Listagem de Pedidos =========================

app.get('/', async (req,res) =>{
    let tabelaPedidos = await bd.pegarTabela('pedido')
    res.render('pedidosCadastrados', {tabela:tabelaPedidos})
})

//========================= Cadastro de Pedidos =========================
app.get('/cadastroPedido', (req, res) => {
    res.render('cadastroPedido');
});

app.post('/postCadastroPedido', async (req,res) => {
    let dadosPedido = Object.values(req.body) //armazenei só os valores do que veio do formulário, na ordem em que eles estão lá
    
    let pedido = new Pedido(...dadosPedido as [string, string, string, string, string,string,string,string,Date,string])
    /* aqui eu estou criando um novo pedido (classe)
       utilizei um operador chamado spread, são esses '...' para atribuir os valores necessários que foram passados no construtor da classe,
       como eu estou utilizando só os valores do que foi preenchido no form, é necessário especificar os tipos no array seguinte.
       IMPORTANTE: como o spread só distribui os valores em sequência, a ordem que a gente recebe os dados do forms tem que ser a mesma ordem
       do construtor da classe, porque caso dois atributos em sequência tiverem o mesmo tipo e vierem na ordem errada, ficarão com a os valores trocados*/

    await bd.inserirPedido(pedido) //método da clase bancoDados para inserir na tabela pedido
    let tabelaPedido = await bd.pegarTabela('pedido') //método para consultar a tabela inteira
    console.log(tabelaPedido)
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



app.listen(8080, () => {
    console.log(`servidor rodando em http://localhost:${PORT}`);
});

//npm install - instala as dependências
//npx tsc - compilar o código 
//ts-node-esm - executar arquivos .ts