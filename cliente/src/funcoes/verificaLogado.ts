import api from "../services/api"

export default async function verificaLogado(){
    const login = await api.get('/confereLogado')
    console.log(`Session: ${login.data}`)
    if (login.data.logado){
        return {funcao:login.data.funcao, logado:true}
    }
    else{
        return {funcao:null, logado:false}
    }
      
}