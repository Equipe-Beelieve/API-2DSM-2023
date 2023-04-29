import * as mysql from 'mysql2/promise' //importando os módulos necessários
import { RowDataPacket } from 'mysql2'; //é responsável por reconhecer o tipo de dados retorndos por determinada consulta 
import Endereco from './Endereco.js'
import Fornecedor from './Fornecedor.js'
import Pedido from './Pedido.js'
import Usuario from './Usuario.js'
import Produto from './Produto.js'
import NotaFiscal from './NotaFiscal.js';

export default class bancoDados { //clase que contém, a princípio, tudo envolvendo banco de dados
    private conexao: mysql.Connection //atributo que tem o tipo "conexão com MySQL"

    async conectar() {
        try {
            this.conexao = await mysql.createConnection({ //o await é utilizado para garantir que a instrução vai ser executada antes de partir para a próxima, você verá o termo se repetir várias vezes no código
                host: 'localhost',
                user: 'root',
                password: '', //sua senha
                database: 'api', //base de dados do api
                port: 3306
            })
            //o método tenta se conectar com o banco na sua máquina utilizando as informações passadas
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

    async pegarLinha(tabela:string, campo:string, condicao:any) {
        await this.conectar()
        let linha = await this.conexao.query(`SELECT * FROM ${tabela} WHERE ${campo} = ${condicao}` )
        await this.conexao.end()
        return linha[0]
    }

    async pegarCodigo(codigo:string, tabela:string, campo:string, condicao:any): Promise<number> {
        await this.conectar()
        let [consulta] = await this.conexao.query(`SELECT ${codigo} FROM ${tabela} WHERE ${campo} = ?`, [condicao]) as Array<any>
        let linha = consulta[0]
        await this.conexao.end()
        return linha[codigo]
    }


    async inserirPedido(pedido:Pedido) { //aqui a função recebe um argumento do tipo Pedido (que é uma classe)
        await this.conectar()
        await this.conexao.query('INSERT INTO pedido(ped_razao_social,ped_transportadora,ped_tipo_frete,ped_produto_massa,ped_descricao,ped_valor_unidade,ped_valor_total,ped_data_entrega,ped_condicao_pagamento, ped_data_pedido) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
        [pedido['razao_social'], pedido['transportadora'] ,pedido['tipo_frete'], pedido['produto_massa'], pedido['descricao'],pedido['valor_unidade'],pedido['valor_total'],pedido['data_entrega'],pedido['condicao_pagamento'], pedido['data_pedido']]) //o primeiro parâmetro é a execução SQL e o segundo é um array acessando as informações específicas do pedido para cada campo. As '?' nos VALUES indica que eles receberão variáveis
        await this.conexao.end()
    }

    async pegarListaFornecedores() {
        await this.conectar()
        let [consulta, meta]:any = await this.conexao.query(`SELECT f.for_codigo, f.for_cnpj, f.for_razao_social, f.for_nome_fantasia, e.end_cep FROM fornecedor f, endereco_fornecedor e Where f.end_codigo=e.end_codigo`) //o pacote do mysql2 retorna 1 array com 2 arrays dentro dele numa consulta ao banco, um com resultados e outro com metadados da busca, os [] nas variáveis separa os resultado em arrays diferentes. É uma funcionalidade chamada de 'destructring arrays'
        await this.conexao.end() 
        return consulta
    }

    async pegarRazaoSocial() {
        await this.conectar()
        let [consulta, meta]:any = await this.conexao.query(`SELECT for_razao_social FROM fornecedor`) //o pacote do mysql2 retorna 1 array com 2 arrays dentro dele numa consulta ao banco, um com resultados e outro com metadados da busca, os [] nas variáveis separa os resultado em arrays diferentes. É uma funcionalidade chamada de 'destructring arrays'
        await this.conexao.end() 
        return consulta
    }

    async pegarListaPedidos() {
        await this.conectar()
        let [consulta, meta]:any = await this.conexao.query(`SELECT ped_codigo, ped_razao_social, ped_produto_massa, ped_descricao, ped_valor_total, date_format(ped_data_entrega, '%d/%m/%Y') as ped_data_entrega, ped_status  FROM pedido`) //o pacote do mysql2 retorna 1 array com 2 arrays dentro dele numa consulta ao banco, um com resultados e outro com metadados da busca, os [] nas variáveis separa os resultado em arrays diferentes. É uma funcionalidade chamada de 'destructring arrays'
        await this.conexao.end() 
        return consulta
    }

    async inserirEndereco(endereco:Endereco) {
        await this.conexao.query('INSERT INTO endereco_fornecedor(end_cep, end_estado, end_cidade, end_bairro, end_rua_avenida, end_numero) VALUES(?, ?, ?, ?, ?, ?)', [endereco['cep'], endereco['estado'], endereco['cidade'], endereco['bairro'], endereco['rua_avenida'], endereco['numero']])
        let end_codigo = await this.pegarCodigo('end_codigo', 'endereco_fornecedor', 'end_cep', endereco['cep'])
        return end_codigo
    }

    async inserirFornecedor(fornecedor:Fornecedor, endereco:Endereco) {
        await this.conectar()
        let end_codigo = await this.inserirEndereco(endereco)
        await this.conexao.query('INSERT INTO fornecedor(for_cnpj, end_codigo, for_razao_social, for_nome_fantasia) VALUES(?, ?, ?, ?)', [fornecedor['cnpj'], end_codigo, fornecedor['razao_social'], fornecedor['nome_fantasia']])
        await this.conexao.end()
    }

    public async listarFornecedores() {
        await this.conectar()
        let [fornecedores, meta]:any = await this.conexao.query('SELECT f.for_codigo, f.for_cnpj, f.for_razao_social, f.for_nome_fantasia, e.end_cep, e.end_estado, e.end_cidade, e.end_bairro, e.end_rua_avenida, e.end_numero FROM fornecedor f, endereco_fornecedor e WHERE f.end_codigo = e.end_codigo')
        await this.conexao.end()
        return fornecedores
    }

    async inserirUsuario(usuario:Usuario) { 
        await this.conectar()
        await this.conexao.query('INSERT INTO usuario(us_nome,us_senha,us_funcao,us_login) VALUES(?, ?, ?, ?)', [usuario['nome'], usuario['senha'],usuario['funcao'], usuario['login']]) 
        await this.conexao.end()
    }

    public async pegarLogin() {
        await this.conectar()
        let [logins, meta]:any = await this.conexao.query('SELECT us_login FROM usuario')
        await this.conexao.end()
        return logins
    }
      
    public async listarUsuario() {
        await this.conectar()
        let [usuarios, meta]:any = await this.conexao.query('SELECT us_matricula,us_nome, us_senha, us_funcao, us_login FROM usuario')
        await this.conexao.end()
        return usuarios
    }

    async dadosUsuario(credencias:any){
        await this.conectar()
        let [usuario, meta]:any = await this.conexao.query(`SELECT us_matricula,us_nome, us_senha, us_funcao, us_login FROM usuario WHERE us_login = "${credencias.login}" and us_senha = "${credencias.senha}" `)
        console.log(`Login: ${credencias.login} e Senha: ${credencias.senha}`)
        await this.conexao.end()
        return usuario[0] 
    }

    async inserirProduto(produto:Produto) { 
        await this.conectar()
        await this.conexao.query('INSERT INTO produto(prod_descricao, prod_unidade_medida) VALUES(?, ?)', [produto['descricao'], produto['unidade_medida']]) 
        await this.conexao.end()
    }

    async listarProdutos() {
        await this.conectar()
        let [produtos, meta] = await this.conexao.query('SELECT prod_codigo, prod_descricao, prod_unidade_medida FROM produto')
        await this.conexao.end()
        return produtos
    }

    async inserirNF(nf:NotaFiscal) { 
        await this.conectar()
        await this.conexao.query('INSERT INTO nota_fiscal(nf_razao_social, nf_data_emissao, nf_data_entrega, nf_transportadora, nf_produto_massa, nf_tipo_frete, nf_produto_descricao, for_codigo, nf_valor_total, nf_valor_unidade, ped_codigo) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [nf['razao_social'], nf['data_pedido'], nf['data_entrega'], nf['transportadora'], nf['produto_massa'], nf['tipo_frete'], nf['descricao'], nf['codigo_fornecedor'], nf['valor_total'], nf['valor_unidade'], nf['codigo_pedido']]) 
        await this.conexao.end()
    }
}

