import { Pedido } from "../models/Pedido";

export class Recibo {
    static gerar(pedido: Pedido){
        console.log("=========================");
        console.log(`Recibo do pedido ${pedido.id}.`);
        console.log("=========================");
        console.log(`Cliente: ${pedido.cliente.nome}`);
        console.log(`Local de entrega: \n${pedido.cliente.endereco}`)
        console.log(`Data: ${pedido.data}`);
        console.log("-------------------------")
        console.log(`Produtos:`)
        
        for (let i = 0; i < pedido.produtos.length; i++){   
            const produto = pedido.produtos[1];
            console.log(`- ${produto.nome} (R$${produto.valor})`);
        }
        console.log(`Total a pagar: ${pedido.valorTotal}`);
    }
}