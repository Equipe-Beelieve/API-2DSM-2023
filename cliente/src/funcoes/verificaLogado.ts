import api from "../services/api"

export default async function verificaLogado(){
    const login = await api.get('/confereLogado')
    console.log(`Session: ${login.data}`)
    if (login.data.logado){
        return true
    }
    else{
        return false
    }
      
}