import { Pedido } from "../models/Pedido";

export class VendasMensais{
    static gerar(pedidos: Pedido[]){
        const data = new Date();
        const mes = data.getMonth();
        const ano = data.getFullYear();

        const pedidosMes = pedidos.filter(pedido => {
            return(
            data.getMonth() === mes &&
            data.getFullYear() === ano
            );
        });
        let faturamento = 0;
        for (let i = 0; i < pedidosMes.length; i++){
            faturamento += pedidosMes[i].valorTotal;
        }
        const quantidadePedidosMes = pedidosMes.length;
        console.log(`================================`);
        console.log(`Vendas no mês: ${quantidadePedidosMes}`);
        console.log(`Faturamento do mês: $${faturamento}`);
        console.log(`================================`);
    }
}