import { useParams } from "react-router-dom"

function RecebimentoPedido(){
    const {id} = useParams()

    return(
        <h1>Pedido de código: {id}</h1>
    )
}

export default RecebimentoPedido