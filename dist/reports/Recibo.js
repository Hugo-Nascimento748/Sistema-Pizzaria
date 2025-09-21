"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recibo = void 0;
const Formatador_1 = require("../utils/Formatador");
class Recibo {
    static gerar(pedido, pagamento) {
        console.log("=========================");
        console.log(`Recibo do pedido ${pedido.id}.`);
        console.log("=========================");
        console.log(`Cliente: ${pedido.cliente.nome}`);
        console.log(`Local de entrega: ${pedido.cliente.endereco}`);
        console.log(`Data: ${(0, Formatador_1.formatarData)(pedido.data)}`);
        console.log("-------------------------");
        console.log(`Produtos:`);
        pedido.produtos.forEach(p => {
            console.log(`${p.nome} - ${(0, Formatador_1.formatarMoeda)(p.valor)}`);
        });
        console.log(`Total a pagar: ${(0, Formatador_1.formatarMoeda)(pedido.valorTotal)}`);
        console.log(`Forma de pagamento: ${pagamento}`);
        console.log("=========================");
    }
}
exports.Recibo = Recibo;
