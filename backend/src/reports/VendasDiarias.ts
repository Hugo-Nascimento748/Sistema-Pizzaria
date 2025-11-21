import { Pedido } from "../models/Pedido";

export class VendasDiarias{
    static gerar(pedidos: Pedido[]){
        const hoje = new Date();
        const dia = hoje.getDate();
        const mes = hoje.getMonth();
        const ano = hoje.getFullYear();

        const pedidosHoje = pedidos.filter(pedido => {
            const data = pedido.data;
            return(
                data.getDate() === dia &&
                data.getMonth() === mes &&
                data.getFullYear() === ano
            );
        });

        let faturamento = 0;
        for (let i = 0; i < pedidos.length; i++){
            faturamento += pedidosHoje[i].valorTotal;
        }

        const quantidadePedidos = pedidosHoje.length;

        console.log(`=================================`);
        console.log(`Quantidade de pedidos do dia: ${quantidadePedidos}`);
        console.log(`Faturamento do dia: ${faturamento}`);
        console.log(`=================================`);

    }
}