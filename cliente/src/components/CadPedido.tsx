import React from "react";
import NavBar from "./NavBar";

export default function CadPedido(){

    
    return(
    <><NavBar />
        <div className="divFornecedor">
            <h1>Cadastro de Pedidos</h1>
            <form action="/postCadastroPedido" method="post">

                <div className="poscentralized grid-container">
                    <div className="box">
                        <table>
                            <thead>
                                <tr>
                                    <th>Produto:</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><select className="input_form" name="produto" id="produto" required />
                                        <option value=""></option>
                                        <option value="3">Produto 1</option>
                                        <option value="2">Produto 2</option>

                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="box">
                        <table>
                            <thead>
                                <tr>
                                    <th>Data do Pedido:</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><input className="input_form" type="date" id="dataPedido" name="dataPedido" required />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="box">
                        <table>
                            <thead>
                                <tr>
                                    <th>Data de Entrega:</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><input className="input_form" type="date" id="dataEntrega" name="dataEntrega" required />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="poscentralized grid-container">
                    <div className="box">
                        <table>
                            <thead>
                                <tr>
                                    <th>Razão Social(fornecedor):</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><select className="input_form" id="razaoSocial" name="razaoSocial" required />
                                        <option value=""></option>

                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>


                    <div className="box">
                        <table>
                            <thead>
                                <tr>
                                    <th>Preço Unitário:</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><input className="input_form" type="text" id="precoUnitario" name="precoUnitario"
                                        required />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="box">
                        <table>
                            <thead>
                                <tr>
                                    <th>Quantidade:</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><input className="input_form" type="text" id="quantidade" name="quantidade" required />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="poscentralized grid-container">
                    <div className="box">
                        <table>
                            <thead>
                                <tr>
                                    <th>Preço Total:</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><input className="input_form" type="text" id="precoTotal" name="precoTotal" required />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="box">
                        <table>
                            <thead>
                                <tr>
                                    <th>Tipo de Frete:</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><input className="input_form" type="text" id="frete" name="frete" required />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="box">
                        <table>
                            <thead>
                                <tr>
                                    <th>Transportadora:</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><input className="input_form" type="text" id="condicaoPagamento" name="transportadora"
                                        required />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="poscentralized grid-container">
                    <div className="box">
                        <table>
                            <thead>
                                <tr>
                                    <th>Condição de Pagamento:</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><select className="input_form" name="condicaoPagamento" id="condicaoPagamento" required />
                                        <option value=""></option>
                                        <option value="00/100">00/100</option>
                                        <option value="10/90">10/90</option>
                                        <option value="20/80">20/80</option>
                                        <option value="30/70">30/70</option>
                                        <option value="40/60">40/60</option>
                                        <option value="50/50">50/50</option>
                                        <option value="60/40">60/40</option>
                                        <option value="70/30">70/30</option>
                                        <option value="80/20">80/20</option>
                                        <option value="90/10">90/10</option>
                                        <option value="100/00">100/00</option>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>

                <input className="confirm_button" type="submit" value="Cadastrar" />
                <button className="cancel_button">
                    <a href="/">Cancelar</a>
                </button>
            </form>
        </div>
    </>

    )
}


