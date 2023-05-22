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
import trataRelatorioFinal from './trataRelatorioFinal.js';

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
        await this.conexao.query('INSERT INTO pedido(ped_razao_social,' +
            'ped_transportadora,ped_tipo_frete,ped_produto_massa,ped_descricao,ped_valor_unidade,ped_valor_total,' +
            'ped_data_entrega,ped_condicao_pagamento, ped_data_pedido) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [pedido['razao_social'], pedido['transportadora'] ,pedido['tipo_frete'], 
            pedido['produto_massa'], pedido['descricao'],pedido['valor_unidade'],pedido['valor_total'],
            pedido['data_entrega'],pedido['condicao_pagamento'], pedido['data_pedido']])

        /* o primeiro parâmetro é a execução SQL e o segundo é um array acessando as informações específicas do pedido para 
            cada campo. As '?' nos VALUES indica que eles receberão variáveis */

        await this.conexao.end()
    }

    async pegarListaFornecedores() {
        await this.conectar()
        let [consulta, meta]:any = await this.conexao.query(`SELECT f.for_codigo, f.for_cnpj, f.for_razao_social, f.for_nome_fantasia, e.end_cep FROM fornecedor f, endereco_fornecedor e Where f.end_codigo=e.end_codigo`) 
            /* o pacote do mysql2 retorna 1 array com 2 arrays dentro dele numa consulta ao banco, um com resultados e 
                outro com metadados da busca, os [] nas variáveis separa os resultado em arrays diferentes. 
                É uma funcionalidade chamada de 'destructring arrays'*/

        await this.conexao.end() 
        return consulta
    }

    async pegarRazaoSocial() {
        await this.conectar()
        let [consulta, meta]:any = await this.conexao.query(`SELECT for_razao_social FROM fornecedor`) 
        /*o pacote do mysql2 retorna 1 array com 2 arrays dentro dele numa consulta ao banco, um com resultados e outro 
            com metadados da busca, os [] nas variáveis separa os resultado em arrays diferentes. É uma funcionalidade chamada 
            de 'destructring arrays' */
        
        await this.conexao.end() 
        return consulta
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
        await this.conexao.query('INSERT INTO endereco_fornecedor(end_cep, end_estado, end_cidade, end_bairro,' + 
                'end_rua_avenida, end_numero) VALUES(?, ?, ?, ?, ?, ?)', [endereco['cep'], endereco['estado'], endereco['cidade'], 
                endereco['bairro'], endereco['rua_avenida'], endereco['numero']])

        let end_codigo = await this.pegarCodigo('end_codigo', 'endereco_fornecedor', 'end_cep', endereco['cep'])
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

    async inserirRegrasRecebimento(tipo_regra:string, valor:string, obrigatoriedade:boolean, codigo_produto:number) {
        await this.conectar()
        await this.conexao.query('INSERT INTO regras_de_recebimento(reg_tipo, reg_valor, reg_obrigatoriedade, prod_codigo) VALUES(?, ?, ?, ?)', [tipo_regra, valor, obrigatoriedade, codigo_produto])
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
        console.log(`CODIGOPEDIDO: ${nf['codigo_pedido']}`)
        if (nf['codigo_fornecedor'] !== 0){
            await this.conexao.query('INSERT INTO nota_fiscal(nf_razao_social, nf_data_emissao, nf_data_entrega, nf_transportadora, nf_produto_massa, nf_tipo_frete, nf_produto_descricao, nf_valor_total, nf_valor_unidade, for_codigo, nf_condicao_pagamento, nf_unidade, ped_codigo) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            [nf['razao_social'], nf['data_pedido'], nf['data_entrega'], nf['transportadora'], nf['produto_massa'], nf['tipo_frete'], nf['descricao'], nf['valor_total'], nf['valor_unidade'], nf['codigo_fornecedor'], nf['condicao_pagamento'], nf['unidade'], nf['codigo_pedido']]) 
        }
        else{
            await this.conexao.query('INSERT INTO nota_fiscal(nf_razao_social, nf_data_emissao, nf_data_entrega, nf_transportadora, nf_produto_massa, nf_tipo_frete, nf_produto_descricao, nf_valor_total, nf_valor_unidade, for_codigo, nf_condicao_pagamento, nf_unidade, ped_codigo) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            [nf['razao_social'], nf['data_pedido'], nf['data_entrega'], nf['transportadora'], nf['produto_massa'], nf['tipo_frete'], nf['descricao'], nf['valor_total'], nf['valor_unidade'], null, nf['condicao_pagamento'], nf['unidade'],  nf['codigo_pedido']]) 
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
        let [dado] = await this.conexao.query(`Select ped_razao_social, ped_transportadora, ped_tipo_frete, ped_produto_massa, ped_descricao, ped_valor_unidade, ped_valor_total, ped_data_entrega, ped_data_pedido, ped_condicao_pagamento FROM pedido WHERE ped_codigo =${id}`) as Array<any>
        await this.conexao.end()
        const [pedido] = dado.map((linha:any) => new Pedido(linha.ped_descricao, linha.ped_data_pedido, linha.ped_data_entrega, linha.ped_razao_social, linha.ped_valor_unidade, linha.ped_produto_massa, linha.ped_valor_total, linha.ped_tipo_frete, linha.ped_transportadora, linha.ped_condicao_pagamento))
        return pedido
    }

    async pegaRegraRecebimento(id:string) {
        await this.conectar()
        let [regras, meta] = await this.conexao.query(`SELECT reg_codigo, reg_tipo, reg_valor, reg_obrigatoriedade FROM regras_de_recebimento WHERE prod_codigo = ${id} and reg_tipo <> 'Mínimo de conformidade'`)
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
        await this.conexao.query(`UPDATE pedido SET ped_razao_social = '${pedido['razao_social']}', ped_transportadora = '${pedido['transportadora']}', ped_tipo_frete = '${pedido['tipo_frete']}', ped_produto_massa = '${pedido['produto_massa']}', ped_descricao = '${pedido['descricao']}', ped_valor_unidade = '${pedido['valor_unidade']}', ped_valor_total = '${pedido['valor_total']}', ped_data_entrega = '${pedido['data_entrega']}', ped_data_pedido = '${pedido['data_pedido']}', ped_condicao_pagamento = '${pedido['condicao_pagamento']}' WHERE ped_codigo = ${id}`)
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
            await this.conexao.query(`UPDATE nota_fiscal SET nf_razao_social = '${nf['razao_social']}', nf_data_emissao = '${nf['data_pedido'].slice(0, 10)}', nf_data_entrega = '${nf['data_entrega'].slice(0, 10)}', nf_transportadora = '${nf['transportadora']}', nf_produto_massa = '${nf['produto_massa']}', nf_tipo_frete = '${nf['tipo_frete']}', nf_produto_descricao = '${nf['descricao']}', nf_valor_total = '${nf['valor_total']}', nf_valor_unidade = '${nf['valor_unidade']}', for_codigo = ${nf['codigo_fornecedor']}, nf_condicao_pagamento = '${nf['condicao_pagamento']}', nf_unidade = '${nf['unidade']}'  WHERE ped_codigo = ${nf['codigo_pedido']}`)
        }
        else{
            await this.conexao.query(`UPDATE nota_fiscal SET nf_razao_social = '${nf['razao_social']}', nf_data_emissao = '${nf['data_pedido'].slice(0, 10)}', nf_data_entrega = '${nf['data_entrega'].slice(0, 10)}', nf_transportadora = '${nf['transportadora']}', nf_produto_massa = '${nf['produto_massa']}', nf_tipo_frete = '${nf['tipo_frete']}', nf_produto_descricao = '${nf['descricao']}', nf_valor_total = '${nf['valor_total']}', nf_valor_unidade = '${nf['valor_unidade']}', nf_condicao_pagamento = '${nf['condicao_pagamento']}', nf_unidade = '${nf['unidade']}'  WHERE ped_codigo = ${nf['codigo_pedido']}`)
        }
        await this.conexao.end()
    }

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

    async updateUsuario(usuario:Usuario, id: number){
        await this.conectar()
        await this.conexao.query(`UPDATE usuario SET us_nome = '${usuario['nome']}', us_senha = '${usuario['senha']}', us_funcao = '${usuario['funcao']}', us_login = '${usuario['login']}' WHERE us_matricula = '${id}'`)
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
    

    //===================== Relatório Final =====================

    async pegaDadosRelatorioFinal(id:number){
        await this.conectar()
        let [dadosRecebimento] = await this.conexao.query(`SELECT p.ped_razao_social, p.ped_transportadora, p.ped_tipo_frete, p.ped_produto_massa, p.ped_descricao, p.ped_valor_unidade, p.ped_valor_total, p.ped_data_entrega, p.ped_data_pedido, p.ped_condicao_pagamento, 
        nf.nf_razao_social, nf.nf_data_emissao, nf.nf_data_entrega, nf.nf_transportadora, nf.nf_produto_massa, nf.nf_tipo_frete, nf.nf_produto_descricao, nf.nf_laudo, nf.nf_valor_total, nf.nf_valor_unidade, nf.nf_condicao_pagamento, nf.nf_unidade FROM pedido p, nota_fiscal nf
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
        return relatorioFinal
    }

}



