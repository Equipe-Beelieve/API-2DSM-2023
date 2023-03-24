import * as mysql from 'mysql2/promise' //importando os módulos necessários
import Pedido from './Pedido.js'

export default class bancoDados { //clase que contém, a princípio, tudo envolvendo banco de dados
    private conexao: mysql.Connection //atributo que tem o tipo "conexão com MySQL"

    async conectar() {
        try {
            this.conexao = await mysql.createConnection({ //o await é utilizado para garantir que a instrução vai ser executada antes de partir para a próxima, você verá o termo se repetir várias vezes no código
                host: 'localhost',
                user: 'root',
                password: 'fatec', //sua senha
                database: 'api', //base de dados do api
                port: 3306
            })
            console.log('Conexão com o banco de dados estabelecida')
            //o método tenta se conectar com o banco na sua máquina utilizando as informações passadas e exibe uma mensagem no terminal se obtiver êxito
        } catch(erro) {
            console.log('Erro na conexão com o banco de dados', erro)
            //caso encontre algum erro ele exibe a mensagem e o erro em seguida
        }
    }

    async pegarTabela(tabela:string) {
        await this.conectar()
        let [consulta, meta]:any = await this.conexao.query(`SELECT * FROM ${tabela}`) //o pacote do mysql2 retorna 1 array com 2 arrays dentro dele numa consulta ao banco, um com resultados e outro com metadados da busca, os [] nas variáveis separa os resultado em arrays diferentes. É uma funcionalidade chamada de 'destructring arrays'
        await this.conexao.end() //fecha a conexão com o banco depois de usá-lo
        return consulta
    }

    async inserirPedido(pedido:Pedido) { //aqui a função recebe um argumento do tipo Pedido (que é uma classe que eu criei)
        await this.conectar()
        await this.conexao.query('INSERT INTO pedido(ped_razao_social,ped_nome_fantasia,ped_transportadora,ped_tipo_frete,ped_produto_massa,ped_descricao,ped_valor_unidade,ped_valor_total,ped_data_entrega,ped_condicao_pagamento) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [pedido['razao_social'], pedido['nome_fantasia'],pedido['transportadora'] ,pedido['tipo_frete'], pedido['produto_massa'], pedido['descricao'],pedido['valor_unidade'],pedido['valor_total'],pedido['data_entrega'],pedido['condicao_pagamento']]) //o primeiro parâmetro é a execução SQL e o segundo é um array acessando as informações específicas do pedido para cada campo. As '?' nos VALUES indica que eles receberão variáveis
        await this.conexao.end()
    }
}