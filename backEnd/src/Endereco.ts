export default class Endereco {
    cep:string
    estado:string
    cidade:string
    bairro:string
    rua_avenida:string
    numero:string

    constructor(cep:string, estado:string, cidade:string, bairro:string, rua_avenida:string, numero:string) {
        this.cep = cep
        this.estado = estado
        this.cidade = cidade
        this.bairro = bairro
        this.rua_avenida = rua_avenida
        this.numero = numero
    }
}