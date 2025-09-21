import { Pedido } from "../models/Pedido";
import { formatarData, formatarMoeda } from "../utils/Formatador";

export class Recibo {
    static gerar(pedido: Pedido, pagamento: string){
        console.log("=========================");
        console.log(`Recibo do pedido ${pedido.id}.`);
        console.log("=========================");
        console.log(`Cliente: ${pedido.cliente.nome}`);
        console.log(`Local de entrega: ${pedido.cliente.endereco}`);
        console.log(`Data: ${formatarData(pedido.data)}`);
        console.log("-------------------------");
        console.log(`Produtos:`);
        
        pedido.produtos.forEach(p => {
            console.log(`${p.nome} - ${formatarMoeda(p.valor)}`);
        });

        console.log(`Total a pagar: ${formatarMoeda(pedido.valorTotal)}`);
        console.log(`Forma de pagamento: ${pagamento}`);
        console.log("=========================");
    }
}
