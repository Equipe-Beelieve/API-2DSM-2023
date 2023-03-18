import bancoDados from "./bancoDados.js";
import Pedido from "./Pedido.js";
const bd = new bancoDados; //criando uma instância do bd para utilizar os métodos
let pedido = new Pedido('fornecedor1', 'transportadora1', 'caminhao', '50.00', 'nenhuma', new Date(), 1); // criei um pedido novo passando as infos pro construtor.
/* ainda não sei lidar com datas no typescript, então eu
mudei o script do banco para aceitar data/hora e passei um
negócio aí que pega a atual*/
await bd.inserirPedido(pedido); //usando o método de inserir pedidos em cima da instância do bd, usando o pedido que acabou de ser criado como argumento
let tabelaPedido = await bd.pegarTabela('pedido'); //usando o outro método para pegar todas linhas da tabela na qual a gente acabou de inserir
console.log(tabelaPedido);
