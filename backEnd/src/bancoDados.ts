import * as mysql from 'mysql2/promise' //importando os módulos necessários
import { RowDataPacket, OkPacket } from 'mysql2'; //é responsável por reconhecer o tipo de dados retorndos por determinada consulta 
import Endereco from './Endereco.js'
import Fornecedor from './Fornecedor.js'
import Pedido from './Pedido.js'
import Qualitativa from './RegraRecebimento.js'
import Usuario from './Usuario.js'
import Produto from './Produto.js'
import NotaFiscal from './NotaFiscal.js';
import AnaliseQualitativa from './Analisequalitativa.js';
import {trataRelatorioFinal, formatarData} from './trataRelatorioFinal.js';
import RelatorioFinal from './RelatorioFinal.js';
import RegrasAnalises from './RegrasAnalises.js';
import comparaDadosHistoricos from './comparaDadosHistoricos.js';

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
            //o método tenta se conectar com o banco na sua máquina utilizando as informações passadas
        } catch(erro) {
            console.log('Erro na conexão com o banco de dados', erro)
            //caso encontre algum erro ele exibe a mensagem e o erro em seguida
        }
    }

    async desconectar(){
        await this.conexao.end()
    }

    async pegarTabela(tabela:string) {
        await this.conectar()
        let [consulta, meta]:any = await this.conexao.query(`SELECT * FROM ${tabela}`) 
        /* o pacote do mysql2 retorna 1 array com 2 arrays dentro dele numa consulta ao banco, 
            um com resultados e outro com metadados da busca, os [] nas variáveis separa os resultado em arrays diferentes. 
            É uma funcionalidade chamada de 'destructring arrays'*/

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
        let [consulta] = await this.conexao.query(`SELECT ${codigo} FROM ${tabela} WHERE ${campo} = "${condicao}"`) as Array<any>
        let linha = consulta[0]
        await this.conexao.end()
        //console.log(linha)
        if (linha){
            return linha[codigo]
        }
        else{
            return 0
        }
    }


    async inserirPedido(pedido:Pedido) { //aqui a função recebe um argumento do tipo Pedido (que é uma classe)
        await this.conectar()
        await this.conexao.query('INSERT INTO pedido(ped_razao_social, ped_cnpj,' +
            'ped_transportadora,ped_tipo_frete,ped_produto_massa,ped_descricao,ped_valor_unidade,ped_valor_total,' +
            'ped_data_entrega,ped_condicao_pagamento, ped_data_pedido) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [pedido['razao_social'], pedido['cnpj'], pedido['transportadora'] ,pedido['tipo_frete'], 
            pedido['produto_massa'], pedido['descricao'],pedido['valor_unidade'],pedido['valor_total'],
            pedido['data_entrega'],pedido['condicao_pagamento'], pedido['data_pedido']])

        /* o primeiro parâmetro é a execução SQL e o segundo é um array acessando as informações específicas do pedido para 
            cada campo. As '?' nos VALUES indica que eles receberão variáveis */

        await this.conexao.end()
    }

    async pegarListaFornecedores() {
        await this.conectar()
        let [consulta, meta]:any = await this.conexao.query(`SELECT f.for_codigo, f.for_cnpj, f.for_razao_social, f.for_nome_fantasia, e.end_cep FROM fornecedor f, endereco_fornecedor e Where f.end_codigo=e.end_codigo AND f.for_ativo = 1`) 
            /* o pacote do mysql2 retorna 1 array com 2 arrays dentro dele numa consulta ao banco, um com resultados e 
                outro com metadados da busca, os [] nas variáveis separa os resultado em arrays diferentes. 
                É uma funcionalidade chamada de 'destructring arrays'*/

        await this.conexao.end() 
        return consulta
    }

    async pegarRazaoSocial() {
        await this.conectar()
        let [consulta, meta]:any = await this.conexao.query(`SELECT for_razao_social, for_cnpj FROM fornecedor WHERE for_ativo = 1`) 
        /*o pacote do mysql2 retorna 1 array com 2 arrays dentro dele numa consulta ao banco, um com resultados e outro 
            com metadados da busca, os [] nas variáveis separa os resultado em arrays diferentes. É uma funcionalidade chamada 
            de 'destructring arrays' */
        
        await this.conexao.end() 
        return consulta
    }

    async pegarCNPJ(){
        await this.conectar()
        let [cnpjs] = await this.conexao.query('SELECT for_cnpj FROM fornecedor WHERE for_ativo = 1')
        await this.conexao.end()
        return cnpjs
    }

    async pegarListaPedidos() {
        await this.conectar()
        let [consulta, meta]:any = await this.conexao.query(`SELECT ped_codigo, ped_razao_social, ped_produto_massa, 
            ped_descricao, ped_valor_total, date_format(ped_data_entrega, '%d/%m/%Y') as ped_data_entrega, ped_status  FROM pedido`) 
            /*o pacote do mysql2 retorna 1 array com 2 arrays dentro dele numa consulta ao banco, um com resultados e outro com metadados 
                da busca, os [] nas variáveis separa os resultado em arrays diferentes. É uma funcionalidade chamada de 'destructring arrays'*/
        
        await this.conexao.end() 
        return consulta
    }

    async inserirEndereco(endereco:Endereco) {
        await this.conectar()
        let [insert, fields]:[mysql.OkPacket, mysql.FieldPacket[]] = await this.conexao.query('INSERT INTO endereco_fornecedor(end_cep, end_estado, end_cidade, end_bairro,' + 
                'end_rua_avenida, end_numero) VALUES(?, ?, ?, ?, ?, ?)', [endereco['cep'], endereco['estado'], endereco['cidade'], 
                endereco['bairro'], endereco['rua_avenida'], endereco['numero']])

        let end_codigo = insert.insertId
        await this.conexao.end()
        return end_codigo
    }

    async inserirFornecedor(fornecedor:Fornecedor, endereco:Endereco) {
        let end_codigo = await this.inserirEndereco(endereco)
        await this.conectar()
        await this.conexao.query('INSERT INTO fornecedor(for_cnpj, end_codigo, for_razao_social, for_nome_fantasia)'+
            'VALUES(?, ?, ?, ?)', [fornecedor['cnpj'], end_codigo, fornecedor['razao_social'], fornecedor['nome_fantasia']])
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
        let [insert, fields]:[mysql.OkPacket, mysql.FieldPacket[]] = await this.conexao.query('INSERT INTO produto(prod_descricao, prod_unidade_medida) VALUES(?, ?)', [produto['descricao'], produto['unidade_medida']]) 
        let prod_cod = insert.insertId
        await this.conexao.end()
        return prod_cod
    }

    async inserirRegrasRecebimento(tipo_regra:string, valor:string, codigo_produto:number) {
        await this.conectar()
        await this.conexao.query('INSERT INTO regras_de_recebimento(reg_tipo, reg_valor, prod_codigo) VALUES(?, ?, ?)', [tipo_regra, valor, codigo_produto])
        await this.conexao.end()
    }

    async listarProdutos() {
        await this.conectar()
        let [produtos, meta] = await this.conexao.query('SELECT prod_codigo, prod_descricao, prod_unidade_medida FROM produto where prod_ativo = 1')
        await this.conexao.end()
        return produtos
    }

    async listarProdutoDescricao() {
        await this.conectar()
        let [produtos, meta] = await this.conexao.query('SELECT prod_descricao FROM produto') as Array<any>
        await this.conexao.end()
        return produtos
    }

    async inserirNF(nf:NotaFiscal) { 
        await this.conectar()
        console.log(`CODIGOPEDIDO: ${nf['codigo_pedido']}`)
        if (nf['codigo_fornecedor'] !== 0){
            await this.conexao.query('INSERT INTO nota_fiscal(nf_cnpj, nf_data_emissao, nf_data_entrega, nf_transportadora, nf_produto_massa, nf_tipo_frete, nf_produto_descricao, nf_valor_total, nf_valor_unidade, for_codigo, nf_condicao_pagamento, nf_unidade, ped_codigo) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            [nf['cnpj'], nf['data_pedido'], nf['data_entrega'], nf['transportadora'], nf['produto_massa'], nf['tipo_frete'], nf['descricao'], nf['valor_total'], nf['valor_unidade'], nf['codigo_fornecedor'], nf['condicao_pagamento'], nf['unidade'], nf['codigo_pedido']]) 
        }
        else{
            await this.conexao.query('INSERT INTO nota_fiscal(nf_cnpj, nf_data_emissao, nf_data_entrega, nf_transportadora, nf_produto_massa, nf_tipo_frete, nf_produto_descricao, nf_valor_total, nf_valor_unidade, for_codigo, nf_condicao_pagamento, nf_unidade, ped_codigo) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            [nf['cnpj'], nf['data_pedido'], nf['data_entrega'], nf['transportadora'], nf['produto_massa'], nf['tipo_frete'], nf['descricao'], nf['valor_total'], nf['valor_unidade'], null, nf['condicao_pagamento'], nf['unidade'],  nf['codigo_pedido']]) 
        }
        await this.conexao.end()
        await this.mudaStatus(nf['codigo_pedido'], 'Análise Quantitativa')
    }
    

    async mudaStatus(codigo:number, status:string){
        await this.conectar()
        await this.conexao.query(`UPDATE pedido SET ped_status = '${status}' WHERE ped_codigo = ${codigo}`)
        await this.conexao.end()
    }

    async inserirAnaliseQuantitativa(id:string, pesagem:string){
        await this.conectar()
        let [prod_codigo] = await this.conexao.query(`SELECT prod_codigo FROM produto WHERE prod_descricao = (SELECT ped_descricao FROM pedido WHERE ped_codigo=${id})`) as Array<any>
        await this.conexao.query(`INSERT INTO parametros_do_pedido(regra_tipo, regra_valor, prod_codigo, ped_codigo) VALUES("Análise Quantitativa", "${pesagem}", ${prod_codigo[0].prod_codigo}, ${id})`)
        await this.conexao.query(`UPDATE pedido SET ped_status = 'Análise Qualitativa' WHERE ped_codigo=${id}`)
        await this.conexao.end()
    }

    async pegaStatus(id:string){
        await this.conectar()
        let [dado] = await this.conexao.query(`SELECT ped_status FROM pedido WHERE ped_codigo = ${id}`) as Array<any>
        await this.conexao.end()
        return dado[0].ped_status
    }

    async pegaNf(id:string){
        await this.conectar()
        let [dado] = await this.conexao.query(`SELECT * FROM nota_fiscal WHERE ped_codigo = ${id}`) as Array<any>
        await this.conexao.end()
        return dado[0]
    }

    async pegaAnaliseQuantitativa(id:string){
        await this.conectar()
        let [dado] = await this.conexao.query(`Select regra_valor FROM parametros_do_pedido WHERE ped_codigo = ${id} and regra_tipo = "Análise Quantitativa"`) as Array<any>
        await this.conexao.end()
        return dado[0]
    }

    async pegaAnaliseQualitativa(id:string){
        await this.conectar()
        let [dado] = await this.conexao.query(`SELECT p.par_codigo, p.regra_tipo, p.regra_valor, a.av_comentario as regra_avaria FROM parametros_do_pedido p LEFT OUTER JOIN avaria_comentario a ON p.par_codigo = a.par_codigo WHERE p.ped_codigo = ${id} AND p.regra_tipo != 'Análise Quantitativa'`) as Array<any>
        console.log(dado)
        await this.conexao.end()
        return dado
    }

    async pegaRelatorioCompras(id:string):Promise<Pedido> {
        await this.conectar()
        let [dado] = await this.conexao.query(`Select ped_razao_social, ped_cnpj, ped_transportadora, ped_tipo_frete, ped_produto_massa, ped_descricao, ped_valor_unidade, ped_valor_total, ped_data_entrega, ped_data_pedido, ped_condicao_pagamento FROM pedido WHERE ped_codigo =${id}`) as Array<any>
        await this.conexao.end()
        const [pedido] = dado.map((linha:any) => new Pedido(linha.ped_descricao, linha.ped_data_pedido, linha.ped_data_entrega, linha.ped_cnpj, linha.ped_valor_unidade, linha.ped_produto_massa, linha.ped_valor_total, linha.ped_tipo_frete, linha.ped_transportadora, linha.ped_condicao_pagamento, linha.ped_razao_social))
        return pedido
    }

    async pegaProduto(id:string){
        await this.conectar()
        let [produto] = await this.conexao.query(`Select prod_descricao, prod_unidade_medida FROM produto WHERE prod_codigo = ${id}`) as Array<any>
        await this.conexao.end()
        await this.conectar()
        let [regras] = await this.conexao.query(`Select reg_tipo as tipo, reg_valor as valor FROM regras_de_recebimento WHERE prod_codigo = ${id}`) as Array<any>
        await this.conexao.end()
        produto = {
            descricao: produto[0].prod_descricao,
            unidadeMedida: produto[0].prod_unidade_medida,
            regras: regras
        }
        return produto
    }

    async pegaFornecedor(id:string){
        await this.conectar()
        let [consulta] = await this.conexao.query(`SELECT f.for_cnpj, f.for_razao_social, f.for_nome_fantasia, e.end_cep, e.end_estado, e.end_cidade, e.end_bairro, e.end_rua_avenida, e.end_numero FROM fornecedor f INNER JOIN endereco_fornecedor e ON f.end_codigo = e.end_codigo AND f.end_codigo = ${id}`) as Array<any>
        await this.conexao.end()
        let fornecedor = consulta[0]
        let endereco = new Endereco(fornecedor.end_cep, fornecedor.end_estado, fornecedor.end_cidade, fornecedor.end_bairro, fornecedor.end_rua_avenida, fornecedor.end_numero)
        fornecedor = new Fornecedor(fornecedor.for_cnpj, endereco, fornecedor.for_razao_social, fornecedor.for_nome_fantasia)

        return fornecedor
    }


    async pegaRegraRecebimento(id:string) {
        await this.conectar()
        let [regras, meta] = await this.conexao.query(`SELECT reg_codigo, reg_tipo, reg_valor FROM regras_de_recebimento WHERE prod_codigo = ${id} and reg_tipo <> 'Mínimo de conformidade'`)
        await this.conexao.end()
        return regras
    }

    async inserirAnaliseQualitativa(id: string, analiseQualitativa: AnaliseQualitativa){
        await this.conectar()
        let [prod_codigo] = await this.conexao.query(`SELECT prod_codigo FROM produto WHERE prod_descricao = (SELECT ped_descricao FROM pedido WHERE ped_codigo=${id})`)  as Array<any>
        let [insert, fields]:[mysql.OkPacket, mysql.FieldPacket[]] = await this.conexao.query(`INSERT INTO parametros_do_pedido(regra_tipo, regra_valor, prod_codigo, ped_codigo, reg_codigo) VALUES(?, ?, ${prod_codigo[0].prod_codigo}, ${id}, ${analiseQualitativa['codigo']})`,
        [analiseQualitativa['tipo'], analiseQualitativa['valor']])
        await this.conexao.end()
        if(analiseQualitativa['avaria'] !== undefined && analiseQualitativa['avaria'] != ''){    
            await this.insereComentarioAvaria(insert.insertId, analiseQualitativa['avaria'])
        }
    }

    async insereComentarioAvaria(insertId:number, avaria:string){
        await this.conectar()
        await this.conexao.query(`INSERT INTO avaria_comentario(av_comentario, par_codigo) VALUES(?, ${insertId})`, [avaria])
        await this.conexao.end()
    }

    //!!!!!!!!!!!!!!! APAGAR NA PRÓXIMA SPRINT !!!!!!!!!!!!!!!
    
    async mudaFinalizado(id:string){
        await this.conectar()
        await this.conexao.query(`UPDATE pedido SET ped_status = 'Finalizado' WHERE ped_codigo = ${id}`)
        await this.conexao.end()
    }

    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    //Confere unidade
    async condereUnidade(id:string){
        await this.conectar()
        let [unidade, meta] = await this.conexao.query(`SELECT ped_produto_massa FROM pedido WHERE ped_codigo = ${id}`) as Array<any>
        await this.conexao.end()
        if(unidade[0].ped_produto_massa.slice(-1) === 't'){
            unidade[0].ped_produto_massa = 't'
        }
        else{
            console.log(`UNIDADEEEE ${unidade[0].ped_produto_massa.slice(-2)}`)
            unidade[0].ped_produto_massa = unidade[0].ped_produto_massa.slice(-2)
        }
        console.log(unidade[0].ped_produto_massa)
        return unidade[0].ped_produto_massa
    }


    //===================== UPDATE =====================

    async updatePedido(pedido:Pedido, id:string, trocaUnidade:boolean, unidade:string){
        await this.conectar()
        await this.conexao.query(`UPDATE pedido SET ped_razao_social = '${pedido['razao_social']}', ped_cnpj = '${pedido['cnpj']}', ped_transportadora = '${pedido['transportadora']}', ped_tipo_frete = '${pedido['tipo_frete']}', ped_produto_massa = '${pedido['produto_massa']}', ped_descricao = '${pedido['descricao']}', ped_valor_unidade = '${pedido['valor_unidade']}', ped_valor_total = '${pedido['valor_total']}', ped_data_entrega = '${pedido['data_entrega']}', ped_data_pedido = '${pedido['data_pedido']}', ped_condicao_pagamento = '${pedido['condicao_pagamento']}' WHERE ped_codigo = ${id}`)
        if(trocaUnidade){
            let [pesagem] = await this.conexao.query(`SELECT regra_valor FROM parametros_do_pedido WHERE ped_codigo = ${id} and regra_tipo = 'Análise Quantitativa'`) as Array<any>
            pesagem = pesagem[0].regra_valor
            console.log(`A unidade é ${unidade} || A pesagem é ${pesagem}`)
            if(pesagem.slice(-1) === 'g'){
                pesagem = parseFloat(pesagem.slice(0, -2))
                pesagem = pesagem / 1000
                pesagem = pesagem.toString()
                console.log(`Conversão ${pesagem}`)
                pesagem = pesagem + ' t'
            }
            else{
                pesagem = parseFloat(pesagem.slice(0, -1))
                pesagem = pesagem * 1000
                pesagem = pesagem.toString()
                pesagem = pesagem + ' kg'
            }
            await this.conexao.query(`UPDATE parametros_do_pedido SET regra_valor = '${pesagem}' WHERE ped_codigo = ${id} and regra_tipo = 'Análise Quantitativa'`)
        }
        await this.conexao.end()
    }

    async updateNF(nf:NotaFiscal) { 
        await this.conectar()
        if (nf['codigo_fornecedor'] !== 0){
            await this.conexao.query(`UPDATE nota_fiscal SET nf_cnpj = '${nf['cnpj']}', nf_data_emissao = '${nf['data_pedido'].slice(0, 10)}', nf_data_entrega = '${nf['data_entrega'].slice(0, 10)}', nf_transportadora = '${nf['transportadora']}', nf_produto_massa = '${nf['produto_massa']}', nf_tipo_frete = '${nf['tipo_frete']}', nf_produto_descricao = '${nf['descricao']}', nf_valor_total = '${nf['valor_total']}', nf_valor_unidade = '${nf['valor_unidade']}', for_codigo = ${nf['codigo_fornecedor']}, nf_condicao_pagamento = '${nf['condicao_pagamento']}', nf_unidade = '${nf['unidade']}'  WHERE ped_codigo = ${nf['codigo_pedido']}`)
        }
        else{
            await this.conexao.query(`UPDATE nota_fiscal SET nf_cnpj = '${nf['cnpj']}', nf_data_emissao = '${nf['data_pedido'].slice(0, 10)}', nf_data_entrega = '${nf['data_entrega'].slice(0, 10)}', nf_transportadora = '${nf['transportadora']}', nf_produto_massa = '${nf['produto_massa']}', nf_tipo_frete = '${nf['tipo_frete']}', nf_produto_descricao = '${nf['descricao']}', nf_valor_total = '${nf['valor_total']}', nf_valor_unidade = '${nf['valor_unidade']}', nf_condicao_pagamento = '${nf['condicao_pagamento']}', nf_unidade = '${nf['unidade']}'  WHERE ped_codigo = ${nf['codigo_pedido']}`)
        }
        await this.conexao.end()
    }


    async updateProduto(id:string, descricao:string, unidadeMedida:string, regrasRecebimento:any){
        await this.conectar()
        let [descricaoAnterior] = await this.conexao.query(`SELECT prod_descricao FROM produto WHERE prod_codigo = ${id}`) as Array<any>
        await this.conexao.end()
        await this.conectar()
        await this.conexao.query(`UPDATE produto SET prod_descricao = '${descricao}', prod_unidade_medida = '${unidadeMedida}' WHERE prod_codigo = ${id}`)
        await this.conexao.end()
        console.log(descricaoAnterior[0])
        if (descricaoAnterior[0] !== descricao){
            await this.conectar()
            await this.conexao.query(`UPDATE pedido SET ped_descricao = '${descricao}' WHERE ped_descricao = '${descricaoAnterior[0].prod_descricao}' and ped_status <> 'Aceito' and ped_status <> 'Recusado' and ped_status <> 'Finalizado'`)
            await this.conexao.end()
            await this.conectar()
            await this.conexao.query(`UPDATE nota_fiscal SET nf_produto_descricao = '${descricao}' WHERE nf_produto_descricao = '${descricaoAnterior[0].prod_descricao}' and ped_codigo in (SELECT ped_codigo FROM pedido WHERE ped_descricao = '${descricao}' and ped_status <> 'Aceito' and ped_status <> 'Recusado' and ped_status <> 'Finalizado')`)
            await this.conexao.end()
        }
        await this.conectar()
        await this.conexao.query(`DELETE FROM avaria_comentario WHERE par_codigo = (SELECT par_codigo FROM parametros_do_pedido WHERE prod_codigo = ${id} and regra_tipo = 'Avaria')`)
        await this.conexao.end()
        await this.conectar()
        await this.conexao.query(`DELETE FROM parametros_do_pedido WHERE prod_codigo = ${id} and regra_tipo <> 'Análise Quantitativa'`)
        await this.conexao.end()
        await this.conectar()  
        await this.conexao.query(`DELETE FROM regras_de_recebimento WHERE prod_codigo = ${id}`)
        await this.conexao.end()
        regrasRecebimento.forEach(async (regra:any)=>{
            await this.inserirRegrasRecebimento(regra.tipo, regra.valor, parseInt(id))
        })
    }

    async updateFornecedor(fornecedor: Fornecedor, id:string){
        await this.conectar()
        let [razaoAntiga] = await this.conexao.query('SELECT for_razao_social FROM fornecedor WHERE for_codigo = ?', [id]) as Array<any>
        await this.conexao.query(`UPDATE fornecedor SET for_razao_social = ?, for_nome_fantasia = ? WHERE for_codigo = ?`, [fornecedor['razao_social'], fornecedor['nome_fantasia'], id])
        if(razaoAntiga[0].for_razao_social !== fornecedor['razao_social']){
            await this.conexao.query('UPDATE pedido SET ped_razao_social = ? WHERE ped_razao_social = ?', [fornecedor['razao_social'], razaoAntiga[0].for_razao_social])
        }
        await this.conexao.end()

        await this.conectar()
        let [codigoEndereco] = await this.conexao.query(`SELECT end_codigo FROM fornecedor WHERE for_codigo = ?`, [id]) as Array<any>
        await this.conexao.query('UPDATE endereco_fornecedor SET end_cep = ?, end_estado = ?, end_cidade = ?, end_bairro = ?, end_rua_avenida = ?, end_numero = ? WHERE end_codigo = ?',
        [fornecedor['endereco'].cep, fornecedor['endereco'].estado, fornecedor['endereco'].cidade, fornecedor['endereco'].bairro, fornecedor['endereco'].rua_avenida,
        fornecedor['endereco'].numero, codigoEndereco[0].end_codigo])
        await this.conexao.end()

    
    }    
    //=========================================================

    async laudoNF(id:string, laudo:string){
        await this.conectar()
        await this.conexao.query(`UPDATE nota_fiscal SET nf_laudo = ? WHERE ped_codigo = ?`, [laudo, id])
        await this.conexao.end()
    }

    async pegaLaudoNF(id:string){
        await this.conectar()
        let [laudo, meta] = await this.conexao.query(`SELECT nf_laudo FROM nota_fiscal WHERE ped_codigo = ${id}`) as Array<any>
        await this.conexao.end()
        return laudo[0]
    }

    async updateLaudoNF(id:string, laudo:string){
        await this.conectar()
        await this.conexao.query(`UPDATE nota_fiscal SET nf_laudo = '${laudo}' WHERE ped_codigo = ${id}`)
    }

    async updateQuantitativa(id:string, pesagem:string){
        await this.conectar()
        await this.conexao.query(`Update parametros_do_pedido SET regra_valor = '${pesagem}' WHERE regra_tipo = 'Análise Quantitativa' and ped_codigo = ${id}`)
        await this.conexao.end()
    }

    async updateQualitativa(analise:any){
        await this.conectar()
        await this.conexao.query(`UPDATE parametros_do_pedido SET regra_valor = ? WHERE par_codigo = ?`, [analise['valor'], analise['id']])
        if(analise['avaria'] !== undefined && analise['avaria'] !== '') {
            let [av_comentario] = await this.conexao.query(`SELECT av_comentario FROM avaria_comentario WHERE par_codigo = ${analise['id']}`) as Array<any>
            if(av_comentario.length > 0){
                await this.conexao.query(`UPDATE avaria_comentario SET av_comentario = ? WHERE par_codigo = ?`, [analise['avaria'], analise['id']])
            } else {
                await this.conexao.query(`INSERT INTO avaria_comentario(av_comentario, par_codigo) VALUES(?, ?)`, [analise['avaria'], analise['id']])
            }
        } else if(analise['avaria'] === '') {
            await this.conexao.query(`DELETE FROM avaria_comentario WHERE par_codigo = ?`, [analise['id']])
        } 
    }

    async pegaUsuario(id: number){
        await this.conectar()
        let [usuario, meta]:any =  await this.conexao.query(`SELECT * from usuario WHERE us_matricula = '${id}'`)
        await this.conexao.end()
        return usuario[0]
    }

    async quantidadeFuncaoAdministrador(){
        await this.conectar()
        let [quantidadeFuncaoAdministrador, meta]:any = await this.conexao.query(`SELECT COUNT('us_funcao') from usuario WHERE us_funcao = 'Administrador'`)
        await this.conexao.end()
        //console.log('ADM: ', quantidadeFuncaoAdministrador[0])
        return quantidadeFuncaoAdministrador[0]
    }

    async updateUsuario(usuario:Usuario, id: number){
        await this.conectar()
        await this.conexao.query(`UPDATE usuario SET us_nome = '${usuario['nome']}', us_senha = '${usuario['senha']}', us_funcao = '${usuario['funcao']}', us_login = '${usuario['login']}' WHERE us_matricula = '${id}'`)
        await this.conexao.end()
    }

//===================== Deletes =====================

    //DELETE PEDIDO
    async deletePedido(post: number) {
        await this.conectar()
        await this.conexao.query(`DELETE FROM pedido WHERE ped_codigo = ${post}`)
        await this.conexao.end()
    }

    //DELETE USUARIO
    async deletaUsuario(id:string){
        await this.conectar()
        await this.conexao.query(`DELETE FROM usuario WHERE us_matricula = ${id}`)
        await this.conexao.end()
    }

    //DELETE FORNECEDOR
    async confereFornecedor(id:string){
        await this.conectar()
        let [consultaRazaoSocial] = await this.conexao.query(`SELECT for_razao_social FROM fornecedor WHERE for_codigo = ${id}`) as Array<any>
        await this.conexao.end()

        let razaoSocial = consultaRazaoSocial[0].for_razao_social
        await this.conectar()
        let [existeFornecedor] = await this.conexao.query(`SELECT ped_codigo FROM pedido WHERE ped_razao_social = '${razaoSocial}'`) as Array<any>
        await this.conexao.end()

        return existeFornecedor.length > 0
    }

    async deletaFornecedor(id:string){
        await this.conectar()
        await this.conexao.query(`UPDATE fornecedor SET for_ativo = 0 WHERE for_codigo = ${id}`)
        await this.conexao.end()
    }
    

    // //DELETE PRODUTO
    async confereProduto(id:string){
        await this.conectar()
        let [consultaProduto] = await this.conexao.query(`SELECT prod_descricao FROM produto where prod_codigo = ${id}`) as Array<any>

        let produtoDescricao = consultaProduto[0].prod_descricao
        await this.conectar()
        let [existeProduto] = await this.conexao.query(`SELECT ped_codigo FROM pedido WHERE ped_descricao = '${produtoDescricao}'`) as Array<any>
        await this.conexao.end()
        return existeProduto.length > 0
    }

     async deletaProduto(id:string){
        await this.conectar()
        await this.conexao.query(`DELETE FROM regras_de_recebimento WHERE prod_codigo = ${id}`)
        await this.conexao.end()
        await this.conectar()
        await this.conexao.query(`DELETE FROM produto WHERE prod_codigo = ${id}`)
        await this.conexao.end()
    }

    //===================== Relatório Final =====================

    async pegaDadosRelatorioFinal(id:number, status:string){
        let relatorioFinal:RelatorioFinal
        console.log(`===================================== ${status} ========================================`)
        if(status === 'Finalizado'){
            await this.conectar()
            let [dadosRecebimento] = await this.conexao.query(`SELECT p.ped_cnpj, p.ped_transportadora, p.ped_tipo_frete, p.ped_produto_massa, p.ped_descricao, p.ped_valor_unidade, p.ped_valor_total, p.ped_data_entrega, p.ped_data_pedido, p.ped_condicao_pagamento, 
            nf.nf_cnpj, nf.nf_data_emissao, nf.nf_data_entrega, nf.nf_transportadora, nf.nf_produto_massa, nf.nf_tipo_frete, nf.nf_produto_descricao, nf.nf_laudo, nf.nf_valor_total, nf.nf_valor_unidade, nf.nf_condicao_pagamento, nf.nf_unidade FROM pedido p, nota_fiscal nf
            WHERE p.ped_codigo = ${id} and p.ped_codigo = nf.ped_codigo`) as Array<any>
            await this.conexao.end()
            await this.conectar()
            let [regraAnalise] = await this.conexao.query(`SELECT p.regra_tipo, p.regra_valor, r.reg_valor as regra, a.av_comentario
            FROM produto prod, parametros_do_pedido p 
            LEFT JOIN avaria_comentario a ON p.par_codigo = a.par_codigo
            LEFT JOIN regras_de_recebimento r ON p.reg_codigo = r.reg_codigo
            WHERE p.ped_codigo = ${id} and p.prod_codigo = prod.prod_codigo and prod.prod_codigo = r.prod_codigo`) as Array<any>
            await this.conexao.end()
            await this.conectar()
            let [analiseQuantitativa] = await this.conexao.query(`SELECT regra_tipo, regra_valor FROM parametros_do_pedido WHERE ped_codigo = ${id}`) as Array<any>
            await this.conexao.end()
            
            console.log(dadosRecebimento[0])
            let relatorioFinal = trataRelatorioFinal(dadosRecebimento[0], regraAnalise, analiseQuantitativa[0])
            await this.mudaStatus(id, relatorioFinal.DecisaoFinal)
            
            return relatorioFinal
        }
        else{
            await this.conectar()
            let [dadosRecebimento] = await this.conexao.query(`SELECT p.ped_cnpj, p.ped_transportadora, p.ped_tipo_frete, p.ped_produto_massa, p.ped_descricao, p.ped_valor_unidade, p.ped_valor_total, p.ped_data_entrega, p.ped_data_pedido, p.ped_condicao_pagamento, p.ped_status,
            nf.nf_cnpj, nf.nf_data_emissao, nf.nf_data_entrega, nf.nf_transportadora, nf.nf_produto_massa, nf.nf_tipo_frete, nf.nf_produto_descricao, nf.nf_laudo, nf.nf_valor_total, nf.nf_valor_unidade, nf.nf_condicao_pagamento, nf.nf_unidade FROM pedido p, nota_fiscal nf
            WHERE p.ped_codigo = ${id} and p.ped_codigo = nf.ped_codigo`) as Array<any>
            await this.conexao.end()
            await this.conectar()
            console.log(`SELECT h.historico_tipo, h.historico_regra, h.historico_analise, h.historico_resultado, hav.historico_avaria_comentario FROM historico_analise h LEFT JOIN historico_avaria hav ON h.historico_codigo = hav.historico_codigo and h.ped_codigo = ${id} WHERE h.ped_codigo = ${id}`)
            let [regraAnalise] = await this.conexao.query(`SELECT h.historico_tipo, h.historico_regra, h.historico_analise, h.historico_resultado, hav.historico_avaria_comentario FROM historico_analise h LEFT JOIN historico_avaria hav ON h.historico_codigo = hav.historico_codigo and h.ped_codigo = ${id} WHERE h.ped_codigo = ${id}`) as Array<any>
            await this.conexao.end()
            let analise:Array<RegrasAnalises> = []
            regraAnalise.forEach((regra:any)=>{
                let linha:RegrasAnalises
                if(regra.historico_avaria_comentario !== undefined){
                    linha = {tipo:regra.historico_tipo, regra:regra.historico_regra, valor:regra.historico_analise, avaria:regra.historico_avaria_comentario}
                }
                else{
                    linha = {tipo:regra.historico_tipo, regra:regra.historico_regra, valor:regra.historico_analise}
                }
                analise.push(linha)
            })
            // console.log(dadosRecebimento)
            dadosRecebimento = dadosRecebimento[0]
            relatorioFinal = {
                pedido:{
                    CNPJ:dadosRecebimento.ped_cnpj,
                    Transportadora:dadosRecebimento.ped_transportadora,
                    TipoFrete:dadosRecebimento.ped_tipo_frete,
                    Quantidade:dadosRecebimento.ped_produto_massa,
                    Produto:dadosRecebimento.ped_descricao,
                    ValorUnitario:dadosRecebimento.ped_valor_unidade,
                    ValorTotal:dadosRecebimento.ped_valor_total,
                    DataEntrega:formatarData(dadosRecebimento.ped_data_entrega),
                    DataPedido:formatarData(dadosRecebimento.ped_data_pedido),
                    CondicaoPagamento:dadosRecebimento.ped_condicao_pagamento
                },
                notaFiscal:{
                    CNPJ:dadosRecebimento.nf_cnpj,
                    Transportadora:dadosRecebimento.nf_transportadora,
                    TipoFrete:dadosRecebimento.nf_tipo_frete,
                    Quantidade:dadosRecebimento.nf_produto_massa,
                    Produto:dadosRecebimento.nf_produto_descricao,
                    ValorUnitario:dadosRecebimento.nf_valor_unidade,
                    ValorTotal:dadosRecebimento.nf_valor_total,
                    DataEntrega:formatarData(dadosRecebimento.nf_data_entrega),
                    DataPedido:formatarData(dadosRecebimento.nf_data_emissao),
                    CondicaoPagamento:dadosRecebimento.nf_condicao_pagamento,
                    Laudo:dadosRecebimento.nf_laudo
                },
                RegrasAnalises:analise,

                Resultados:comparaDadosHistoricos(dadosRecebimento, regraAnalise),

                DecisaoFinal:dadosRecebimento.ped_status

            }
            return relatorioFinal
        }       
    }

    async mudaStatusFinal(decisao:string, id:number) {
        await this.conectar()
        await this.conexao.query(`UPDATE pedido SET ped_status = '${decisao}' WHERE ped_codigo = ${id}`)
        await this.conexao.end()
    }

    async guardaResultadoAnalise(regra:RegrasAnalises, id:number){
        if(regra.tipo === 'Personalizada'){
            await this.conectar()
            await this.conexao.query(`INSERT INTO historico_analise(historico_tipo, historico_regra, historico_analise, historico_resultado, ped_codigo) VALUES('${regra.tipo}', '${regra.regra}', '${regra.valor}', ${regra.valor}, ${id})`)
            await this.conexao.end()
        }
        else if(regra.tipo === 'Pureza'){
            let reg = parseFloat(regra.regra.slice(1, -1))
            let valor = parseFloat(regra.valor.slice(0, -1))
            let resultado:boolean
            if(valor>reg){resultado = true} else{resultado = false}
            await this.conectar()
            await this.conexao.query(`INSERT INTO historico_analise(historico_tipo, historico_regra, historico_analise, historico_resultado, ped_codigo) VALUES('${regra.tipo}', '${regra.regra}', '${regra.valor}', ${resultado}, ${id})`)
            await this.conexao.end()
        }
        else if(regra.tipo === 'Umidade'){
            let reg = parseFloat(regra.regra.slice(1, -1))
            let valor = parseFloat(regra.valor.slice(0, -1))
            let resultado:boolean
            if(valor<reg){resultado = true} else{resultado = false}
            await this.conectar()
            await this.conexao.query(`INSERT INTO historico_analise(historico_tipo, historico_regra, historico_analise, historico_resultado, ped_codigo) VALUES('${regra.tipo}', '${regra.regra}', '${regra.valor}', ${resultado}, ${id})`)
            await this.conexao.end()
        }
        else if(regra.tipo === 'Análise Quantitativa'){
            let pesoMinimo
            let pesoMaximo
            let valor
            let resultado
            if(regra.regra.slice(-1) === 't' && regra.valor.slice(-1) === 't'){
                pesoMaximo = parseFloat(regra.regra.slice(0,-2)) * 1.05
                pesoMinimo = parseFloat(regra.regra.slice(0,-2)) * 0.95
                valor = parseFloat(regra.valor.slice(0,-2))
            }
            else if (regra.regra.slice(-1) === 'g' && regra.valor.slice(-1) === 'g'){
                pesoMaximo = parseFloat(regra.regra.slice(0,-3)) * 1.05
                pesoMinimo = parseFloat(regra.regra.slice(0,-3)) * 0.95
                valor = parseFloat(regra.valor.slice(0,-23))
            }
            else{
                resultado = false
            }
            if(pesoMaximo !== undefined && valor !== undefined && pesoMinimo !== undefined && pesoMaximo >= valor && pesoMinimo <= valor){
                resultado =true
            }
            else{
                resultado = false
            }
            await this.conectar()
            await this.conexao.query(`INSERT INTO historico_analise(historico_tipo, historico_regra, historico_analise, historico_resultado, ped_codigo) VALUES('${regra.tipo}', '${regra.regra}', '${regra.valor}', ${resultado}, ${id})`)
            await this.conexao.end()
        }
        else{
            
            await this.conectar()
            await this.conexao.query(`INSERT INTO historico_analise(historico_tipo, historico_regra, historico_analise, historico_resultado, ped_codigo) VALUES('${regra.tipo}', '${regra.regra}', '${regra.valor}', ${regra.valor}, ${id})`)
            await this.conexao.end()
            await this.conectar()
            let [id_historico] = await this.conexao.query(`SELECT historico_codigo FROM historico_analise WHERE ped_codigo = ${id} and historico_tipo = 'Avaria'`) as Array<any>
            await this.conexao.end()
            await this.conectar()
            await this.conexao.query(`INSERT INTO historico_avaria(historico_avaria_comentario, historico_codigo) VALUES('${regra.avaria}', ${id_historico[0].historico_codigo})`)
            await this.conexao.end()
        }
         
    }
}



