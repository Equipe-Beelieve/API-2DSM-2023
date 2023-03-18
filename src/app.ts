import express from 'express';
import bodyParser from "body-parser";

const PORT = 8080;
const app = express();

app.set('view engine','ejs')

app.use(bodyParser.urlencoded({extended: true }));

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