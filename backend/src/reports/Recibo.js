"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recibo = void 0;
var Formatador_1 = require("../utils/Formatador");
var Recibo = /** @class */ (function () {
    function Recibo() {
    }
    Recibo.gerar = function (pedido, pagamento) {
        console.log("=========================");
        console.log("Recibo do pedido ".concat(pedido.id, "."));
        console.log("=========================");
        console.log("Cliente: ".concat(pedido.cliente.nome));
        console.log("Local de entrega: ".concat(pedido.cliente.endereco));
        console.log("Data: ".concat((0, Formatador_1.formatarData)(pedido.data)));
        console.log("-------------------------");
        console.log("Produtos:");
        pedido.produtos.forEach(function (p) {
            console.log("".concat(p.nome, " - ").concat((0, Formatador_1.formatarMoeda)(p.valor)));
        });
        console.log("Total a pagar: ".concat((0, Formatador_1.formatarMoeda)(pedido.valorTotal)));
        console.log("Forma de pagamento: ".concat(pagamento));
        console.log("=========================");
    };
    return Recibo;
}());
exports.Recibo = Recibo;
