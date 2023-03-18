import * as mysql from 'mysql2/promise'; //importando os módulos necessários
export default class bancoDados {
    async conectar() {
        try {
            this.conexao = await mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: 'Meusequel@d0',
                database: 'api',
                port: 3306
            });
            console.log('Conexão com o banco de dados estabelecida');
            //o método tenta se conectar com o banco na sua máquina utilizando as informações passadas e exibe uma mensagem no terminal se obtiver êxito
        }
        catch (erro) {
            console.log('Erro na conexão com o banco de dados', erro);
            //caso encontre algum erro ele exibe a mensagem e o erro em seguida
        }
    }
    async pegarTabela(tabela) {
        await this.conectar();
        let [consulta, meta] = await this.conexao.query(`SELECT * FROM ${tabela}`); //o pacote do mysql2 retorna 1 array com 2 arrays dentro dele numa consulta ao banco, um com resultados e outro com metadados da busca, os [] nas variáveis separa os resultado em arrays diferentes. É uma funcionalidade chamada de 'destructring arrays'
        await this.conexao.end(); //fecha a conexão com o banco depois de usá-lo
        return consulta;
    }
    async inserirPedido(pedido) {
        await this.conectar();
        await this.conexao.query('INSERT INTO pedido(ped_nome_fornecedor, ped_transportadora, ped_tipo_frete, ped_produto_massa, ped_descricao, ped_data_entrega, nf_codigo) VALUES(?, ?, ?, ?, ?, ?, ?)', [pedido['fornecedor'], pedido['transportadora'], pedido['tipo_frete'], pedido['produto_massa'], pedido['descricao'], pedido['data_entrega'], pedido['nota_fiscal']]); //o primeiro parâmetro é a execução SQL e o segundo é um array acessando as informações específicas do pedido para cada campo. As '?' nos VALUES indica que eles receberão variáveis
        await this.conexao.end();
    }
}
