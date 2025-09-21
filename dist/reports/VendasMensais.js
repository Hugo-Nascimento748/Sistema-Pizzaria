"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendasMensais = void 0;
class VendasMensais {
    static gerar(pedidos) {
        const data = new Date();
        const mes = data.getMonth();
        const ano = data.getFullYear();
        const pedidosMes = pedidos.filter(pedido => {
            return (data.getMonth() === mes &&
                data.getFullYear() === ano);
        });
        let faturamento = 0;
        for (let i = 0; i < pedidosMes.length; i++) {
            faturamento += pedidosMes[i].valorTotal;
        }
        const quantidadePedidosMes = pedidosMes.length;
        console.log(`================================`);
        console.log(`Vendas no mês: ${quantidadePedidosMes}`);
        console.log(`Faturamento do mês: $${faturamento}`);
        console.log(`================================`);
    }
}
exports.VendasMensais = VendasMensais;
