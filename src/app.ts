import express from 'express';
import bodyParser from "body-parser";
import bancoDados from "./bancoDados.js"
import Pedido from "./Pedido.js"

const PORT = 8080;
const app = express();
app.set('view engine','ejs')

app.use(bodyParser.urlencoded({extended: true }));

const bd = new bancoDados() //criando uma instância do bd para utilizar os métodos

let pedido = new Pedido('fornecedor1', 'transportadora1', 'caminhao', '50.00', 'nenhuma', new Date(), 1) // criei um pedido novo passando as infos pro construtor.
                                                                                                         /* ainda não sei lidar com datas no typescript, então eu 
                                                                                                         mudei o script do banco para aceitar data/hora e passei um 
                                                                                                         negócio aí que pega a atual*/
    
await bd.inserirPedido(pedido) //usando o método de inserir pedidos em cima da instância do bd, usando o pedido que acabou de ser criado como argumento

let tabelaPedido = await bd.pegarTabela('pedido') //usando o outro método para pegar todas linhas da tabela na qual a gente acabou de inserir

console.log(tabelaPedido)
/*  npm install - instala as dependências
    npx tsc - compilar o código 
    ts-node-esm - executar arquivos */

app.get('/', (req, res) => {
    res.render('cadastroPedido');
});

app.get('/', (req, res) => {
    res.render('cadastro');
});

app.post('/', (req,res) => {
    let nomeFor = req.body.nomeFor;
    let transportadora = req.body.transportadora;
    let descricaoPro = req.body.descricaoPro;
    let dataEnt = req.body.dataEnt;
    let tipoFre = req.body.tipoFre;
    let quantidade = req.body.quantidade;



    res.render('pedidosCadastrados', {nomeFor: nomeFor, transportadora: transportadora, descricaoPro: descricaoPro, dataEnt: dataEnt, tipoFre: tipoFre, quantidade: quantidade});
    console.log(nomeFor + ' ' + transportadora + ' ' + descricaoPro + ' ' + descricaoPro + ' ' + dataEnt + ' ' + tipoFre + ' ' + quantidade)
});
    



app.listen(8080, () => {
    console.log(`servidor rodando em http://localhost:${PORT}`);
});