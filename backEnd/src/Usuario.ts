export default class Usuario {
    public nome:string
    public funcao:string
    public login:string
    public senha:string


    constructor(nome:string, senha:string, funcao:string,  login:string,) {
        this.nome = nome
        this.senha = senha
        this.funcao = funcao
        this.login = login
    }

}