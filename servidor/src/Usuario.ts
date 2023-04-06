export default class Usuario {
    public nome:string
    public senha:string
    public funcao:string
    public login:string
// perguntar: o usuario nao tem endereco??
    constructor(nome:string, senha:string, funcao:string, login:string) {
        this.nome = nome
        this.senha = senha
        this.funcao = funcao
        this.login = login
    }

}